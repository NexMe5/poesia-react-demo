import Reveal from '../../components/Reveal/Reveal';
import ArrowIcon from '../../components/icons/ArrowIcon';
import CopyButton from '../../components/CopyButton/CopyButton';
import { CONTACT } from '../../data/site';

const WAYS = [
  { kind: 'WhatsApp', value: 'Message us', href: CONTACT.whatsapp, external: true },
  { kind: 'Call', value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}`, copy: CONTACT.phone },
  { kind: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, copy: CONTACT.email },
  { kind: 'Visit', value: CONTACT.addressShort, note: CONTACT.addressRest, href: CONTACT.directions, external: true, label: 'Get directions to the Poesia roastery' },
  { kind: 'Follow', value: CONTACT.instagramHandle, note: 'Instagram & Facebook', href: CONTACT.instagram, external: true, label: 'Poesia on Instagram' },
];

/**
 * Every way to reach Poesia, each a full-width row: message, call, email, visit the roastery (opens directions)
 * and follow. Phone and email can be copied in one click; a `note` adds a quieter second line under the value.
 */
export default function ContactWays() {
  return (
    <Reveal as="ul" className="ways">
      {WAYS.map((w) => (
        <li key={w.kind} className={w.copy ? 'has-copy' : undefined}>
          <a className="way" href={w.href} aria-label={w.label} {...(w.external ? { target: '_blank', rel: 'noopener' } : {})}>
            <span className="way-k">{w.kind}</span>
            <span className="way-v">{w.value}{w.note && <small className="way-n">{w.note}</small>}</span>
            <span className="way-a"><ArrowIcon /></span>
          </a>
          {w.copy && <CopyButton value={w.copy} />}
        </li>
      ))}
    </Reveal>
  );
}
