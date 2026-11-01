/** Title lines that each rise from behind their own mask: <span class="line"><span>…</span></span>. */
export default function TitleLines({ lines }) {
  return lines.map((line, i) => (
    <span className="line" key={i}><span>{line}</span></span>
  ));
}
