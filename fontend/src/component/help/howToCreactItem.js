import React from 'react';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import login from '../../image/login.PNG';
import pluss from '../../image/pluss.PNG';
import ItemInput from '../../image/ItemInput.JPG';
import Itemlist from '../../image/ItemList.JPG';

class HowToCreactItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultColor: '#00264d',
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div className="wrapper1">
        <div className="divHelp">
          <img
            src={login}
            alt=""
            style={{
              resizeMode: 'repeat',
              height: 300,
              width: 400,
            }}
          />
        </div>

        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.pressPlus')}</div>

          <img
            src={pluss}
            alt=""
            style={{
              resizeMode: 'repeat',
              height: 300,
              width: 400,
            }}
          />
        </div>

        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('help.pressPlusInput')}</div>

          <img
            src={ItemInput}
            alt=""
            style={{
              resizeMode: 'repeat',
              height: 300,
              width: 400,
            }}
          />
        </div>

        <div className="divHelp">
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('home.text7')}</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#5b5b5b', textAlign: 'lcenter' }}> {t('home.text8')}</div>

          <div className="divHelp">
            <img
              src={Itemlist}
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
export default withTranslation()(HowToCreactItem);
