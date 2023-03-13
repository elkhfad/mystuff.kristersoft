import React from 'react';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import navBarSingUp from '../../image/navBarSingUp.png';
import register from '../../image/registeryForm.PNG';

class HowtoCreateAccount extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div className="wrapper1">
        <div className="divHelp">
          <img
            src={navBarSingUp}
            alt=""
            style={{
              height: 300,
              width: 400,
            }}
          />
        </div>
        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.register')}</div>

          <img
            src={register}
            alt=""
            style={{
              resizeMode: 'repeat',
              height: 300,
              width: 400,
            }}
          />
        </div>
      </div>
    );
  }
}
export default withTranslation()(HowtoCreateAccount);
