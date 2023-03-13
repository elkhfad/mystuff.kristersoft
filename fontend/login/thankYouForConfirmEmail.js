import React, { Component } from 'react';
import '../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: this.resolveAuth(props),
      enable: false,
    };

    this.confirmEmail();
  }

  resolveAuth(props) {
    const search = props.location?.search;
    const indexOfAuthStart = props.location?.search?.indexOf('code=');

    let authString = search.substring(indexOfAuthStart, search.length);
    authString = authString.replace('code=', '');
    const lastIndex = authString.indexOf('&') < 0 ? search.length : authString.indexOf('&');
    authString = authString.substring(authString, lastIndex);
    return authString;
  }
  confirmEmail = () => {
    axios.get(`/api/auth/confirmEmail/?code=${this.state.code}`).then((res) => {
      this.setState({ enable: true });
    });
  };

  render() {
    const { t } = this.props;
    const LogIn = withRouter(({ history }) => (
      <Button
        outline="true"
        onClick={() => {
          history.push('/login');
        }}
      >
        <div className="converstationStrong101">{t('confirmEmail.confirmEmail2')}</div>
      </Button>
    ));
    return (
      <div className="otsikoStyle2">
        <LogIn />
      </div>
    );
  }
}
export default withTranslation()(ConfirmEmail);
