import { cx } from '../../lib/dom';
import { useReveal } from './useReveal';
import './Reveal.css';

/** Flow content that rises in once: `<Reveal as="ul" className="serve">…</Reveal>`. */
export default function Reveal({ as: Tag = 'div', className, children, ...rest }) {
  const reveal = useReveal();
  return <Tag ref={reveal} className={cx(className, 'rv')} {...rest}>{children}</Tag>;
}
