import * as React from 'react';
import * as styles from './style.css';
import { MusicMetaData } from '../../pages/player/player-interfaces';
import { FilterNode } from '../../../systems/system-interfaces';
import { Knob } from '../knob';
import { KaossPad } from '../kaoss-pad';

interface DJPlayerProps {
  meta: MusicMetaData;
  filterNode: FilterNode;
  gainNode: GainNode;
}

interface DJPlayerState {}

export class DJPlayer extends React.Component<DJPlayerProps, DJPlayerState> {
  private container: HTMLDivElement;

  constructor(props: DJPlayerProps, state: DJPlayerState) {
    super(props, state);
  }

  componentDidMount() {
    let passiveSupported = false;
    try {
      document.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function() {
            passiveSupported = true;
          },
        })
      );

      this.container.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();

          const target = (e.target as HTMLElement).getAttribute('data-target');

          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchend',
        (e) => {
          e.preventDefault();

          const target = (e.target as HTMLElement).getAttribute('data-target');
          switch (target) {
            default:
              break;
          }
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  setVolume(volume: number) {
    this.props.gainNode.gain.value = volume / 100;
  }

  setResonance(resonance: number) {
    this.props.filterNode.highPassFilterNode.Q.value = resonance;
    this.props.filterNode.lowPassFilterNode.Q.value = resonance;
  }

  render() {
    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        <div className={styles.knobContainer}>
          <Knob
            min={0}
            max={100}
            initialValue={100}
            color="orange"
            label="VOLUME"
            onChange={(v: number) => this.setVolume(v)}
          />
          <Knob
            min={0}
            max={30}
            initialValue={0}
            color="blue"
            label="RESONANCE"
            onChange={(v: number) => this.setResonance(v)}
          />
        </div>
        <KaossPad vhSize={80} filterNode={this.props.filterNode} />
      </div>
    );
  }
}