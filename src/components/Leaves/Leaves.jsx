import { Fragment, memo } from 'react';
import { LEAF_BRANCHES } from './leafShadow';
import './Leaves.css';

/**
 * A soft leaf shadow. `variant` places it for its chapter:
 * cl-a / cl-b (cream stage), pl-a / pl-b / pl-c (partnership), nl-a / nl-b (+ ne-a / ne-b) (night room).
 */
function Leaves({ variant = '' }) {
  return (
    <svg className={`leaves ${variant}`.trim()} viewBox="0 0 600 420" aria-hidden="true">
      <g fill="#4a2e17">
        {LEAF_BRANCHES.map((b, i) => (
          <Fragment key={i}>
            <path d={b.stem} stroke="#4a2e17" strokeWidth="5" fill="none" />
            {b.leaves.map((leaf, j) => <path key={j} d={leaf.d} transform={leaf.transform} />)}
          </Fragment>
        ))}
      </g>
    </svg>
  );
}

export default memo(Leaves);
