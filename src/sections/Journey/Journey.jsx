import { memo, useRef } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import JourneyCard from './JourneyCard';
import { useScene } from '../../engine/hooks';
import { engine } from '../../engine/scrollEngine';
import { q, qa } from '../../lib/dom';
import { JOURNEY_STEPS } from '../../data/journey';
import './Journey.css';

/**
 * VI · The full coffee journey, told sideways: vertical scroll slides the track,
 * and each photo drifts a little inside its frame (parallax).
 */
function Journey() {
  const ref = useRef(null);
  useScene(ref, (section) => {
    const track = q(section, '.journey-track');
    const photos = qa(section, '.jcard:not(.studio) figure img');
    let distance = 0;
    let centers = [];   // each photo frame's centre within the track, measured in size()
    let trackLeft = 0;
    return {
      lag: 0.12,
      render(p) {
        const shift = -distance * p;
        track.style.transform = `translate3d(${shift}px,0,0)`;
        const vw = window.innerWidth;
        photos.forEach((photo, i) => {
          const c = (trackLeft + centers[i] + shift - vw / 2) / vw;
          photo.style.transform = `translate3d(${-c * 8}%,0,0)`;
        });
      },
      // the section is exactly as tall as the track is wide, plus a short rest at the end
      size() {
        trackLeft = track.offsetLeft;
        centers = photos.map((photo) => { const f = photo.parentElement; return f.offsetLeft + f.offsetWidth / 2; });
        if (engine.reducedMotion) { section.style.height = ''; return; }
        distance = Math.max(0, track.scrollWidth - window.innerWidth);
        section.style.height = `${distance + window.innerHeight * 1.15}px`;
      },
    };
  });

  return (
    <section ref={ref} id="journey" className="scene journey" data-tone="dark" aria-labelledby="journey-h">
      <div className="sticky night">
        <Leaves variant="nl-a" />
        <Leaves variant="nl-b" />
        <div className="journey-track">
          <SectionHeader
            className="jcard jintro"
            label="From soil to cup"
            title={['The full', <>coffee <em>journey</em></>]}
            titleId="journey-h"
          />
          {JOURNEY_STEPS.map((step) => <JourneyCard key={step.title} step={step} />)}
        </div>
      </div>
    </section>
  );
}

export default memo(Journey);
