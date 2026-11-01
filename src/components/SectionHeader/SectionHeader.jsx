import TitleLines from './TitleLines';
import { useReveal } from '../Reveal/useReveal';
import { cx } from '../../lib/dom';
import './SectionHeader.css';

/**
 * The one chapter header: a small copper label, then (optionally) a title whose lines rise in.
 * Every chapter reveals its header the same way.
 */
export default function SectionHeader({
  className,
  label,
  labelAs: Label = 'p',
  labelId,
  title,
  titleId,
  titleAs: Title = 'h2',
}) {
  const reveal = useReveal();
  return (
    <header ref={reveal} className={cx('sh', className)}>
      {label && <Label className="label" id={labelId}>{label}</Label>}
      {title && (
        <Title id={titleId} className="t-title">
          <TitleLines lines={title} />
        </Title>
      )}
    </header>
  );
}
