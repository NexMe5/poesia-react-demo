import Reveal from '../../components/Reveal/Reveal';
import ArrowIcon from '../../components/icons/ArrowIcon';
import CopyButton from '../../components/CopyButton/CopyButton';
import { CONTACT } from '../../data/site';

const WAYS = [
  { kind: 'WhatsApp', value: 'Message us', href: CONTACT.whatsapp, external: true },
  { kind: 'Call', value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}`, copy: CONTACT.phone },
  { kind: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, copy: CONTACT.email },
];

/** Three ways to reach Poesia, each a full-width row; phone and email can be copied in one click. */
export default function ContactWays() {
  return (
    <Reveal as="ul" className="ways">
      {WAYS.map((w) => (
        <li key={w.kind} className={w.copy ? 'has-copy' : undefined}>
          <a className="way" href={w.href} {...(w.external ? { target: '_blank', rel: 'noopener' } : {})}>
            <span className="way-k">{w.kind}</span>
            <span className="way-v">{w.value}</span>
            <span className="way-a"><ArrowIcon /></span>
          </a>
          {w.copy && <CopyButton value={w.copy} />}
        </li>
      ))}
    </Reveal>
  );
}
