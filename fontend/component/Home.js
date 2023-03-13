import React, { Component } from 'react';
import '../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';

class Home extends Component {
  render() {
    const { t } = this.props;
    const Registery = withRouter(({ history }) => (
      <Button
        outline="false"
        style={{ fontSize: '3em', width: '4em', backgroundColor: '#3ac162', borderRadius: '1em', marginTop: '1em', marginLeft: '1em' }}
        onClick={() => {
          history.push('/registery');
        }}
      >
        <div className="registerHome">{t('navBar.signUp')}</div>
      </Button>
    ));
    return (
      <div className="container">
        <div className="wrapperpolicy">
          <div>
            <h1 className="homeotsikoStylepolicy">{t('home.text1')} </h1>
          </div>

          <div className="div1">
            <h2 className="div1">{t('home.text2')}</h2>
          </div>
          <div className="div1">{t('home.text0')}</div>
          <div className="div2">{t('home.text3')}</div>
          <div>
            <Registery />
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(Home);
