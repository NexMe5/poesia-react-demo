/** A blend's name set on the counter edge below its bag: the lead word bold, the rest light. */
export default function BlendTag({ tag }) {
  return (
    <span className="btag">
      {tag.pre && <i>{tag.pre}</i>}
      <b>{tag.lead}</b>
      {tag.tail && <i>{tag.tail}</i>}
    </span>
  );
}
