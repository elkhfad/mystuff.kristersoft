import React, { Component } from 'react';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { Button } from '@material-ui/core';
import swal from 'sweetalert';
import TextField from '@material-ui/core/TextField';
import '../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import { Alert, AlertTitle } from '@material-ui/lab';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  //validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });
  //validate the form was filled out
  Object.values(rest).forEach((val) => {
    (val == null || val.length === 0) && (valid = false);
  });

  return valid;
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      defaultColor: '#00264d',
      email: '',
      formErrors: {
        email: '',
        emailNotFound: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.clearError(name);
    this.validate(name, value);
    this.setState({ [name]: value });
  };
  handleShow = () => {
    this.setState({
      isActive: true,
    });
  };

  handleHide = () => {
    this.setState({
      isActive: false,
    });
  };
  validateForm = (formState) => {
    for (var prop in formState) {
      if (prop === 'formErrors') {
        continue;
      }
      if (formState[prop] instanceof Object) {
        this.validateForm(formState[prop]);
      } else {
        this.validate(prop, formState[prop]);
      }
    }
  };

  validate = (name, value) => {
    let formErrors = this.state.formErrors;
    let { t } = this.props;

    switch (name) {
      case 'email':
        formErrors.email = emailRegex.test(value) ? '' : `${t('register.error.email')}`;
        break;
      case 'emailNotFound':
        formErrors.emailNotFound = value || '';
        break;
      default:
        break;
    }
    this.setState({ formErrors } /*, () => console.log(this.state));*/);
  };
  clearError = (name) => {
    const errors = this.state.formErrors;
    switch (name) {
      case 'email':
        errors.emailNotFound = '';
        this.setState({ formErrors: errors });
        break;
      default:
        break;
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.validateForm(this.state);
    if (!formValid(this.state)) {
      console.info('Invalid Form');
      return;
    }
    const url = `/api/forgot_password?email=${this.state.email}`;

    const data = {
      email: this.state.email,
    };
    let { t } = this.props;
    axios
      .post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          swal({
            text: `${t('forgotPassword.textMessage')}` + this.state.email,
            icon: 'success',
            button: `${t('itemList.swal.ok')}`,
          });

          this.handleClearForm();
          this.props.history.push('/Login');
        }
        if (res.status === 400) {
          this.props.handle.handleSuccessfulAuth(res.data);
          swal(`${t('forgotPassword.swal.errorIcon')}`, `${t('forgotPassword.swal.errorText')}`, `${t('forgotPassword.swal.error')}`);
        }
      })
      .catch((error) => {
        console.error(' forgotPassword error:', error.response);
        if (error.response && error.response.data.key) {
          const data = error.response.data;
          this.validate(data.key, data.message);
          swal(`${t('forgotPassword.swal.errorIcon')}`, `${t('forgotPassword.swal.errorText')}`, `${t('forgotPassword.swal.error')}`);
        } else {
          swal(`${t('forgotPassword.swal.errorIcon')}`, `${t('forgotPassword.swal.errorText')}`, `${t('forgotPassword.swal.error')}`);
        }
      });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleClearForm(e) {
    if (e) {
      e.preventDefault();
    }
    document.getElementById('form').reset();
    this.setState({
      email: '',

      formErrors: {
        email: '',
        emailNotFound: '',
      },
    });
  }

  render() {
    const { formErrors } = this.state;
    const { t } = this.props;
    const Exit = withRouter(({ history }) => (
      <Button
        outline="true"
        onClick={() => {
          history.push('/Login');
        }}
      >
        {t('userDetails.exit')} <ExitToAppIcon> {t('userDetails.exit')}</ExitToAppIcon>
      </Button>
    ));
    return (
      <div className="container">
        <div className="alertRegister">
          <div>
            {this.state.isActive ? (
              <Button onClick={this.handleHide} style={{ display: 'flex', justifyContent: 'right' }}>
                {t('navBar.close')} <CloseIcon />
              </Button>
            ) : (
              <Button onClick={this.handleShow} style={{ display: 'flex', justifyContent: 'right' }}>
                {t('navBar.tips')} <HelpIcon />
              </Button>
            )}
            {this.state.isActive && (
              <div className="alertRegister">
                <Alert
                  severity="info"
                  color="success"
                  style={{
                    color: '#000000',
                    fontSize: '20px',
                    textAlign: 'left',
                    top: '13vh',
                  }}
                >
                  <AlertTitle
                    style={{
                      color: '#000000',
                      fontSize: '20px',
                      textAlign: 'left',
                      top: '13vh',
                    }}
                  >
                    <div className="converstationStrong1">{t('forgotPassword.resetPasswordByEmail')}</div>
                  </AlertTitle>
                </Alert>
              </div>
            )}
          </div>
        </div>
        <div className="form-wrapper">
          <form onSubmit={this.handleSubmit} id="form">
            <div className="forgotPassword">
              <div className="h1LogIn " style={{ backgroundColor: this.state.defaultColor }}>
                {t('forgotPassword.title')}{' '}
                <div className="h1LogIn1" style={{ backgroundColor: this.state.defaultColor }}>
                  <Exit />
                </div>
              </div>
              {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}

              <div className="email">
                <TextField
                  label={t('forgotPassword.email')}
                  className={formErrors.email.length > 0 ? 'error' : null}
                  type="email"
                  name="email"
                  required
                  validate="true"
                  onChange={this.handleChange}
                  style={{ color: '#000000', fontSize: '20px', width: '100%' }}
                />

                {formErrors.email.length > 0 && <span className="errorMessage">{formErrors.email}</span>}
                {formErrors.emailNotFound.length > 0 && <span className="errorMessage">{formErrors.emailNotFound}</span>}
              </div>
            </div>

            <div className="Send Email">
              <Button type="submit" style={{ width: '100%' }} endIcon={<SendIcon> {t('forgotPassword.send')}</SendIcon>}>
                {t('forgotPassword.send')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withTranslation()(ForgotPassword);
