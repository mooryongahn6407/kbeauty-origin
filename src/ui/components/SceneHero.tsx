/**
 * A wide banner of one of the owner's lifestyle photos (public/scenes) at the top of a reading
 * screen, so the screen opens on people rather than on a wall of text. Decorative: the heading
 * below it says what the screen is.
 */
export function SceneHero({ src, focus }: { src: string; focus?: string }) {
  return (
    <figure className="scene-hero" aria-hidden="true">
      <img src={src} alt="" style={focus ? { objectPosition: focus } : undefined} />
    </figure>
  );
}
