import { useEffect, useState } from 'react';
import WhatsAppIcon from '../icons/WhatsAppIcon';
import { WHATSAPP } from '../../data/site';
import { cx } from '../../lib/dom';
import './WhatsAppFloat.css';

/**
 * Floating WhatsApp enquiry with a pre-filled message. Hidden on the opening POESIA screen;
 * it appears once the intro has finished (`armed`) and the visitor has scrolled into the story.
 */
export default function WhatsAppFloat({ armed }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!armed) return undefined;
    const place = () => setShown(window.scrollY > window.innerHeight * 0.9);
    place();
    window.addEventListener('scroll', place, { passive: true });
    return () => window.removeEventListener('scroll', place);
  }, [armed]);

  return (
    <a className={cx('wa-float', shown && 'on')} href={WHATSAPP.enquiry} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <span className="wa-tip">Chat on WhatsApp</span>
      <span className="wa-ico"><WhatsAppIcon /></span>
    </a>
  );
}
