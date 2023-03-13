import React, { Component } from 'react';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';

import MessageToSupport from '../chatMessage/messageToSupport';

class Help extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="container">
        <div className="otsikoStyle2Help">{t('help.help')}</div>
        <div className="helpDialogStyle">
          <div className="messageTopSupport">
            <div className="homeotsikoStyleHelp">{t('help.ifYouWantTOsendMessageTOsupport')}</div>
            <MessageToSupport />
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(Help);
