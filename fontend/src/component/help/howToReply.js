import React from 'react';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import IfoundyourItem from '../../image/IfoundyourItem.JPG';
import yourConverstation from '../../image/yourConverstation.PNG';
import converstationChat from '../../image/converstationChat.JPG';
import resolve from '../../image/resolve.PNG';

class HowToReply extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div className="wrapper1">
        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.text9')}</div>

          <img
            src={IfoundyourItem}
            alt=""
            style={{
              resizeMode: 'repeat',
              height: 300,
              width: 400,
            }}
          />
        </div>
        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.text10')}</div>
          <img
            src={yourConverstation}
            alt=""
            style={{
              resizeMode: 'repeat',
              height: 300,
              width: 400,
            }}
          />
        </div>
        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.text11')}</div>

          <img
            src={converstationChat}
            alt=""
            style={{
              resizeMode: 'repeat',
              height: 300,
              width: 400,
            }}
          />
        </div>
        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.text12')}</div>
          <img
            src={resolve}
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
export default withTranslation()(HowToReply);
