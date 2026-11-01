/** One blend's words: name, tasting note, the arabica/robusta split and the roast level. */
export default function BlendCopy({ blend }) {
  const { id, name, note, accent, arabica, robusta, roast, alt } = blend;
  return (
    <article className={alt ? 'blend wrap alt' : 'blend wrap'} style={{ '--accent': accent }} id={`blend-${id}`}>
      <h2>{name}</h2>
      <p className="note">{note}</p>
      <dl className="specs">
        <div className="spec">
          <dt>Species</dt>
          <dd>
            <div className="split">
              {arabica > 0 && <i className="ara" style={{ width: `${arabica}%` }} />}
              {robusta > 0 && <i className="rob" style={{ width: `${robusta}%` }} />}
            </div>
            <div className="split-l">
              {arabica > 0 && <span><b>Arabica</b> {arabica}%</span>}
              {robusta > 0 && <span><b>Robusta</b> {robusta}%</span>}
            </div>
          </dd>
        </div>
        <div className="spec">
          <dt>Roasting level</dt>
          <dd>
            <span className="roast" role="img" aria-label={`Roast level ${roast} of 5`}>
              {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= roast ? 'on' : undefined} />)}
              <b>{roast}</b>
            </span>
          </dd>
        </div>
      </dl>
    </article>
  );
}
