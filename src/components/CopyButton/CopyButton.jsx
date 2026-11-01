import { useEffect, useRef, useState } from 'react';

/**
 * Copies `value` to the clipboard. Where the clipboard is unavailable it selects the
 * visible value in its row (`.way-v`) so the visitor can copy it by hand.
 */
export default function CopyButton({ value }) {
  const [label, setLabel] = useState('Copy');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (text) => {
    setLabel(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel('Copy'), 1600);
  };

  const onClick = (e) => {
    const button = e.currentTarget;
    const selectRow = () => {
      const target = button.closest('li')?.querySelector('.way-v') ?? button.previousElementSibling;
      if (!target) return;
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      flash('Selected');
    };
    try {
      navigator.clipboard.writeText(value).then(() => flash('Copied'), selectRow);
    } catch {
      selectRow();
    }
  };

  return <button className="copy" type="button" onClick={onClick}>{label}</button>;
}
