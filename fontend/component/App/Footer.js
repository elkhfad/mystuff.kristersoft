import React, { Component } from 'react';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
class Footer extends Component {
  render() {
    const { t } = this.props;
    const DateFull = new Date().getUTCFullYear();
    const Privacy = () => (
      <span
        type="button"
        outline="false"
        onClick={() => {
          window.location.href = '/privacy';
        }}
      >
        {t('navBar.privacy')}
      </span>
    );

    return (
      <div className="container">
        <div className="footer" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
          <p>&copy; Copyright {DateFull}</p>
          <div className="foolerPrivacy">
            <Privacy />
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(Footer);
