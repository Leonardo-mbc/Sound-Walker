import * as React from 'react';
import * as styles from './style.css';
import { KAOSS_PAD } from '../../../constant/target-name';
import { FilterNode } from '../../../systems/system-interfaces';
import { getTouchByTarget } from '../../../utilities/get-touched-touch';

interface KaossPadProps {
  vhSize: number;
  filterNode: FilterNode;
}

interface KaossPadState {
  cursorStyle: CursorStyle;
}

interface CursorStyle {
  opacity: number;
  top: number;
  left: number;
}

export class KaossPad extends React.Component<KaossPadProps, KaossPadState> {
  private container: HTMLDivElement;
  private cursor: HTMLDivElement;

  constructor(props: KaossPadProps, state: KaossPadState) {
    super(props, state);

    this.state = {
      cursorStyle: {
        opacity: 0,
        left: 0,
        top: 0,
      },
    };
  }

  onTouchMove(e: React.TouchEvent<HTMLElement>) {
    this.calcCursorPosition(e);
  }

  onTouchStart(e: React.TouchEvent<HTMLElement>) {
    this.onTouchMove(e);
  }

  onTouchEnd(_e: React.TouchEvent<HTMLElement>) {
    this.props.filterNode.lowPassFilterNode.frequency.value = 44100 * 0.5;

    this.props.filterNode.highPassFilterNode.frequency.value = 0;

    this.setState({
      cursorStyle: {
        ...this.state.cursorStyle,
        opacity: 0,
      },
    });
  }

  calcCursorPosition(e: React.TouchEvent<HTMLElement>) {
    const target = (e.target as HTMLElement).getAttribute('data-target');
    const touch = getTouchByTarget(e.touches, target);

    if (touch) {
      let cursorX = touch.clientX - this.container.offsetLeft;
      let cursorY = touch.clientY - this.container.offsetTop;

      if (cursorX < 0) {
        cursorX = 0;
      } else if (this.container.clientWidth < cursorX) {
        cursorX = this.container.clientWidth;
      }

      if (cursorY < 0) {
        cursorY = 0;
      } else if (this.container.clientHeight < cursorY) {
        cursorY = this.container.clientHeight;
      }

      console.log(
        1 - cursorX / this.container.clientWidth,
        44100 * 0.25 * (1 - cursorX / this.container.clientWidth) + 70,
        cursorY / this.container.clientHeight,
        44100 * 0.25 * (cursorY / this.container.clientHeight)
      );
      this.props.filterNode.highPassFilterNode.frequency.value =
        44100 * 0.25 * (cursorY / this.container.clientHeight);

      this.props.filterNode.lowPassFilterNode.frequency.value =
        44100 * 0.25 * (1 - cursorX / this.container.clientWidth) + 70;

      this.setState({
        cursorStyle: {
          opacity: 1,
          top: cursorY - this.cursor.clientHeight / 2,
          left: cursorX - this.cursor.clientWidth / 2,
        },
      });
    }
  }

  render() {
    const { cursorStyle } = this.state;
    const vhSize = this.props.vhSize || 20;
    const containerStyle = {
      width: `${vhSize}vh`,
      height: `${vhSize}vh`,
    };

    return (
      <div
        ref={(elem) => (this.container = elem)}
        className={styles.container}
        style={containerStyle}
        data-target={KAOSS_PAD}
        onTouchMove={(e) => this.onTouchMove(e)}
        onTouchStart={(e) => this.onTouchStart(e)}
        onTouchEnd={(e) => this.onTouchEnd(e)}
      >
        <div
          ref={(elem) => (this.cursor = elem)}
          style={cursorStyle}
          className={styles.chipCursor}
        />
      </div>
    );
  }
}
