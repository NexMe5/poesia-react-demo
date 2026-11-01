import { memo, useRef } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import EquipmentSet from './EquipmentSet';
import { useScene } from '../../engine/hooks';
import { useLanding } from '../../navigation/landings';
import { docTop, pinLen } from '../../lib/dom';
import { EQUIPMENT_CHAPTERS } from '../../data/equipment';
import { createEquipmentScene } from './equipmentScene';
import './Equipment.css';

/** VII · Equipment & expertise, in the night room. */
function Equipment() {
  const ref = useRef(null);
  useScene(ref, (el) => ({ ...createEquipmentScene(el), lag: 0.12, enter: true }));
  // lands on the MACHINES chapter at rest
  useLanding('#equipment', (el) => docTop(el) + pinLen(el) * 0.07);

  return (
    <section ref={ref} id="equipment" className="scene equip" data-tone="dark" aria-labelledby="equip-h">
      <div className="sticky night">
        <Leaves variant="nl-a" />
        <Leaves variant="nl-b" />
        <SectionHeader className="equip-head wrap" label="Equipment & expertise" labelId="equip-h" />
        <div className="eq-giant" aria-hidden="true">
          {EQUIPMENT_CHAPTERS.map((c) => <span key={c.word}>{c.word}</span>)}
        </div>
        <div className="eq-floor" aria-hidden="true" />
        {EQUIPMENT_CHAPTERS.map((c) => <EquipmentSet key={c.word} chapter={c} />)}
      </div>
    </section>
  );
}

export default memo(Equipment);
