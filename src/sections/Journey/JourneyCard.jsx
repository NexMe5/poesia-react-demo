/** One step of the journey: a photo (or a lit cut-out), its title on the photo's lower edge, a caption. */
export default function JourneyCard({ step }) {
  const { title, caption, src, alt, width, height, position, studio } = step;
  return (
    <article className={studio ? 'jcard studio' : 'jcard'}>
      <figure>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" style={position ? { objectPosition: position } : undefined} />
      </figure>
      <h3>{title}</h3>
      <p className="label">{caption}</p>
    </article>
  );
}
