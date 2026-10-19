/**
 * For partner shops: paste a post before publishing it and see which words could read as a
 * medical claim, a promise or an exaggeration — with the reason and a safer way to say it, in the
 * partner's language. The screen only points; it writes nothing for the partner, keeps nothing,
 * and sends nothing anywhere. "No hits" is never presented as "safe".
 */
import { useMemo, useState } from 'react';
import { SceneHero } from '../components/SceneHero';
import { translate } from '@/localization/messages';
import {
  BAD_EXAMPLE_POST,
  WORDING_RULES,
  checkWording,
  inLocale,
  type WordingHit,
} from '@/content/partner/wording-check';
import { GlyphIcon } from '../components/GlyphIcon';

function Highlighted({ post, hits }: { post: string; hits: readonly WordingHit[] }) {
  const parts: React.ReactNode[] = [];
  let at = 0;
  for (const hit of hits) {
    if (hit.index < at) continue;
    if (hit.index > at) parts.push(post.slice(at, hit.index));
    parts.push(
      <mark key={`${hit.index}-${hit.ruleId}`} className="wording__mark">
        {hit.text}
      </mark>,
    );
    at = hit.index + hit.text.length;
  }
  parts.push(post.slice(at));
  return <p className="wording__post">{parts}</p>;
}

export function WordingCheckScreen({ locale }: { locale: string }) {
  const [post, setPost] = useState('');
  const hits = useMemo(() => checkWording(post), [post]);
  const rules = WORDING_RULES.filter((rule) => hits.some((hit) => hit.ruleId === rule.id));

  return (
    <section className="guide wording" aria-labelledby="wording-title">
      <SceneHero src="/scenes/scene-07.jpg" focus="50% 35%" />
      <h1 className="guide-title" id="wording-title">
        {translate('guide.card.partner.title', locale)}
      </h1>
      <p className="lead">{translate('wording.intro', locale)}</p>

      <label className="settings__label" htmlFor="wording-post">
        {translate('wording.label', locale)}
      </label>
      <textarea
        id="wording-post"
        className="field wording__input"
        rows={6}
        value={post}
        placeholder={translate('wording.placeholder', locale)}
        onChange={(event) => setPost(event.target.value)}
      />
      <div className="store-share">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => setPost(inLocale(BAD_EXAMPLE_POST, locale))}
        >
          {translate('wording.example', locale)}
        </button>
        {post ? (
          <button type="button" className="btn btn--quiet btn--small" onClick={() => setPost('')}>
            {translate('wording.clear', locale)}
          </button>
        ) : null}
      </div>

      {post.trim() === '' ? null : hits.length === 0 ? (
        <p className="disclosure disclosure--info" role="status">
          <span className="disclosure__mark">i</span>
          <span>{translate('wording.none', locale)}</span>
        </p>
      ) : (
        <div role="status">
          <h2 className="guide-subtitle">
            {translate('wording.found', locale, { count: String(hits.length) })}
          </h2>
          <Highlighted post={post} hits={hits} />
          <ul className="points" role="list">
            {rules.map((rule) => (
              <li key={rule.id} className="point wording__rule">
                <span className="point__icon" aria-hidden="true">
                  <GlyphIcon name="warning" />
                </span>
                <span className="point__text">
                  <strong className="point__title">
                    {[
                      ...new Set(
                        hits.filter((hit) => hit.ruleId === rule.id).map((hit) => hit.text),
                      ),
                    ].join(' · ')}
                  </strong>
                  <span className="point__body">
                    <b>{translate('wording.why', locale)}:</b> {inLocale(rule.why, locale)}
                  </span>
                  <span className="point__body">
                    <b>{translate('wording.instead', locale)}:</b> {inLocale(rule.instead, locale)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
