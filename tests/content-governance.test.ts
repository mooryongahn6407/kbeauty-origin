/**
 * Authored-content governance tests.
 *
 * These guard the boundary between "scaffolding we wrote to make a prototype runnable" and
 * "scientific claims", which the handoff command forbids fabricating. They are the tests that
 * should fail if someone later adds ingredient or skin-biology copy to the authored pack.
 */
import { describe, expect, it } from 'vitest';
import { authoredActivities, authoredAtoms, localeCoverage } from '@/content/authored-content';
import { ALL_PLATFORMS, derive } from '@/content/derivation';
import { evaluatePublication } from '@/governance/publication-gate';
import { findEvidenceSource, findNode, findSkill } from '@/knowledge/repository';
import { LOCALES } from '@/localization/locales';

describe('authored content cannot smuggle in fabricated facts', () => {
  it('declares only pedagogical or safety-boundary claims', () => {
    for (const atom of authoredAtoms) {
      expect(['PEDAGOGICAL', 'SAFETY_BOUNDARY']).toContain(atom.claimClass);
    }
    for (const activity of authoredActivities) {
      expect(['PEDAGOGICAL', 'SAFETY_BOUNDARY']).toContain(activity.claimClass);
    }
  });

  it('requires verified evidence behind any SCIENTIFIC atom', () => {
    for (const atom of authoredAtoms.filter((a) => a.claimClass === 'SCIENTIFIC')) {
      expect(atom.evidenceSourceIds.length).toBeGreaterThan(0);
      for (const sourceId of atom.evidenceSourceIds) {
        expect(findEvidenceSource(sourceId)).toBeDefined();
      }
      const node = findNode(atom.nodeId)!;
      expect(evaluatePublication(node).mayStateAsFact).toBe(true);
    }
  });

  it('stays Draft; nothing in code promotes authored content', () => {
    for (const atom of authoredAtoms) {
      expect(atom.reviewStatus).toBe('Draft');
      expect(atom.variants.every((variant) => variant.reviewStatus === 'Draft')).toBe(true);
    }
  });
});

describe('authored IDs and links', () => {
  it('uses an AUTHORED- namespace that cannot collide with a source ID', () => {
    for (const atom of authoredAtoms) expect(atom.atomId).toMatch(/^AUTHORED-ATOM-\d{3}$/);
    for (const activity of authoredActivities) {
      expect(activity.activityId).toMatch(/^AUTHORED-ACT-\d{3}$/);
    }
  });

  it('links every atom and activity to a Knowledge Node and Skill that exist', () => {
    for (const atom of authoredAtoms) {
      expect(findNode(atom.nodeId), atom.atomId).toBeDefined();
      expect(findSkill(atom.skillId), atom.atomId).toBeDefined();
    }
    for (const activity of authoredActivities) {
      expect(findNode(activity.nodeId), activity.activityId).toBeDefined();
      expect(findSkill(activity.skillId), activity.activityId).toBeDefined();
    }
  });

  it('records the node version it was authored against, so drift is detectable', () => {
    for (const atom of authoredAtoms) {
      const node = findNode(atom.nodeId)!;
      expect(atom.nodeVersion).toBe(node.Version);
    }
  });

  it('keeps every activity option set complete and its answer in range', () => {
    for (const activity of authoredActivities) {
      for (const variant of activity.variants) {
        const options = [0, 1, 2].map((i) => variant.text[`option${i}`]);
        expect(options.every(Boolean), `${activity.activityId}/${variant.locale}`).toBe(true);
      }
      expect(activity.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(activity.correctOptionIndex).toBeLessThan(3);
    }
  });

  it('provides the full hint ladder for every activity variant', () => {
    for (const activity of authoredActivities) {
      for (const variant of activity.variants) {
        for (const key of ['hintH1', 'hintH2', 'hintH3'] as const) {
          expect(variant.text[key], `${activity.activityId}/${variant.locale}/${key}`).toBeTruthy();
        }
      }
    }
  });
});

describe('one knowledge -> multi-format -> multi-platform derivation', () => {
  const atom = authoredAtoms[0]!;

  it('derives every platform from the same atom without duplicating the source of fact', () => {
    for (const platform of ALL_PLATFORMS) {
      const result = derive(atom, platform, 'en');
      expect(result.derivative, platform).not.toBeNull();
      expect(result.derivative!.nodeId).toBe(atom.nodeId);
      expect(result.derivative!.nodeVersion).toBe(atom.nodeVersion);
      expect(result.derivative!.claimClass).toBe(atom.claimClass);
    }
  });

  it('gives each platform its own shape from the same canonical text', () => {
    const shorts = derive(atom, 'youtube_shorts', 'en').derivative!;
    const article = derive(atom, 'article', 'en').derivative!;
    expect(shorts.blocks.length).toBeLessThan(article.blocks.length);
    const shortsHook = shorts.blocks.find((block) => block.role === 'hook')!;
    const articleHook = article.blocks.find((block) => block.role === 'hook')!;
    expect(shortsHook.text).toBe(articleHook.text);
  });

  it('derives Korean directly rather than falling back', () => {
    const result = derive(atom, 'app_lesson', 'ko');
    expect(result.usedFallbackLocale).toBe(false);
    expect(result.derivative!.locale).toBe('ko');
  });

  it('reports a locale fallback instead of hiding it', () => {
    const result = derive(atom, 'app_lesson', 'vi');
    expect(result.usedFallbackLocale).toBe(true);
    expect(result.derivative!.locale).toBe('en');
  });
});

describe('locale coverage is reported honestly', () => {
  it('registers the union of both source locale sets without dropping any', () => {
    const tags = LOCALES.map((locale) => locale.tag);
    // Master DB 15_LOCALIZATION locales, including the Laos launch language.
    for (const tag of ['en', 'ko', 'lo', 'th', 'fr', 'es', 'pt']) expect(tags).toContain(tag);
    // Global Content Engine spec languages.
    for (const tag of ['zh', 'ja', 'it', 'vi', 'id']) expect(tags).toContain(tag);
  });

  it('marks which source defines each locale', () => {
    expect(LOCALES.find((l) => l.tag === 'lo')?.origin).toBe('MASTER_DB_15_LOCALIZATION');
    expect(LOCALES.find((l) => l.tag === 'ja')?.origin).toBe('GLOBAL_CONTENT_ENGINE_SPEC');
    expect(LOCALES.find((l) => l.tag === 'ko')?.origin).toBe('BOTH');
  });

  it('reports untranslated locales as zero coverage rather than claiming support', () => {
    const coverage = localeCoverage(LOCALES.map((locale) => locale.tag));
    const lao = coverage.find((item) => item.locale === 'lo')!;
    expect(lao.atomsTranslated).toBe(0);
    expect(lao.activitiesTranslated).toBe(0);

    const korean = coverage.find((item) => item.locale === 'ko')!;
    expect(korean.atomsTranslated).toBe(korean.atomsTotal);
  });
});
