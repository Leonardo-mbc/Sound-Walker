import * as React from 'react';
import * as styles from './style.css';
import { Redirect } from 'react-router';

interface TitleIntroProps {
  isLoadComplete: boolean;
  goToMainMenu: () => void;
}

export class TitleIntro extends React.Component<TitleIntroProps, {}> {
  private container: HTMLDivElement;

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
          this.props.goToMainMenu();
        },
        passiveSupported ? { passive: false } : false
      );

      this.container.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();
        },
        passiveSupported ? { passive: false } : false
      );
    } catch (err) {}
  }

  render() {
    const { isLoadComplete } = this.props;

    return (
      <div ref={(elem) => (this.container = elem)} className={styles.container}>
        {isLoadComplete ? (
          <div className={styles.goToMainMenu}>
            <img
              className={styles.introLogo}
              src="assets/images/logo-anim@x2.gif"
            />
          </div>
        ) : (
          <Redirect to={'/'} />
        )}
      </div>
    );
  }
}
