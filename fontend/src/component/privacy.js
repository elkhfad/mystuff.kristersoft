import React, { Component } from 'react';
import '../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';

class Privacy extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="wrapperpolicy">
        <div className="otsikoStylepolicy">{t('policy.title')}</div>

        <div className="policy">{t('policy.purpose')}</div>
        <div className="policy1">{t('policy.register')}</div>
        <div className="policy">{t('policy.contact')}</div>
        <div className="policy1"> {t('policy.matters')}</div>
        <div className="policy"> {t('policy.forAll')}</div>
        <div className="policy1"> {t('policy.purposeAndUsage')}</div>
        <div className="policy"> {t('policy.keep')}</div>
        <div className="policy1"> {t('policy.content')}</div>
        <div className="policy"> {t('policy.information')}</div>
        <div className="policy"> {t('policy.contain')}</div>
        <div className="policy"> {t('policy.email')}</div>
        <div className="policy"> {t('policy.emailShare')}</div>
        <div className="policy1"> {t('policy.user')}</div>
        <div className="policy1"> {t('policy.service')}</div>
      </div>
    );
  }
}
export default withTranslation()(Privacy);
