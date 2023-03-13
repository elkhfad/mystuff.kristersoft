import React from 'react';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import updateAccount from '../../image/updateAccount.PNG';
import update from '../../image/update.PNG';

class HowToUpdateInfoPress extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div className="wrapper1">
        <div className="divHelp">
          <div className="divHelp">
            <img
              src={update}
              alt=""
              style={{
                resizeMode: 'repeat',
                height: 300,
                width: 400,
              }}
            />
          </div>
        </div>
        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.updateMyAccount')}</div>

          <div className="divHelp">
            <img
              src={updateAccount}
              alt=""
              style={{
                resizeMode: 'repeat',
                height: 300,
                width: 400,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(HowToUpdateInfoPress);
