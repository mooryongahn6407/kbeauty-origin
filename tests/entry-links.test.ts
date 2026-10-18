/**
 * The first screen reads `?play`, `?product=` and «played before?» without loading the game or
 * the catalog. These checks keep the light copies equal to the real thing.
 */
import { describe, expect, it } from 'vitest';
import { CARE_TRACKS } from '@/content/care-quest';
import { productFromSearch } from '@/app/store-catalog';
import { TRACK_IDS, hasPlayedBefore, productShapeFromSearch } from '@/app/entry-links';

describe('entry links', () => {
  it('know exactly the tracks the game has', () => {
    expect([...TRACK_IDS].sort()).toEqual(CARE_TRACKS.map((track) => track.id).sort());
  });

  it('read a product code by shape; the catalog still decides whether it exists', () => {
    expect(productShapeFromSearch('?product=kg-crm-00007')).toBe('KG-CRM-00007');
    expect(productShapeFromSearch('?product=<script>')).toBeNull();
    expect(productShapeFromSearch('')).toBeNull();
    expect(productShapeFromSearch('?product=KG-XXX-99999')).toBe('KG-XXX-99999');
    expect(productFromSearch('?product=KG-XXX-99999')).toBeNull();
  });

  it('tell a returning player from a first-time reader, and survive broken storage', () => {
    const with_ = (data: Record<string, string>) => ({ getItem: (k: string) => data[k] ?? null });
    expect(hasPlayedBefore(with_({}))).toBe(false);
    expect(hasPlayedBefore(with_({ 'korea-glow:care-quest:v1': '{}' }))).toBe(true);
    expect(hasPlayedBefore(with_({ 'korea-glow:care-quest:progress:v1': '{}' }))).toBe(true);
    expect(hasPlayedBefore({ getItem: () => { throw new Error('blocked'); } })).toBe(false);
    expect(hasPlayedBefore(undefined)).toBe(false);
  });
});
