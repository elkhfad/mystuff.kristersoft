import React, { Component } from 'react';
import { Button } from '@material-ui/core';
//import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
//import AssignmentIcon from '@material-ui/icons/Assignment';
import authenticationService from '../authentication/authenticationService';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import TextField from '@material-ui/core/TextField';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';

import { Alert, AlertTitle } from '@material-ui/lab';
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
/*const Register = withRouter(({ history }) => (
  <Button
    onClick={() => {
      history.push('/Register');
    }}
  >
    Register <AssignmentIcon>Register</AssignmentIcon>
  </Button>
));
*/
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      isActive: false,
      defaultColor: '#00264d',
      username: '',
      formErrors: {
        password: '',
        username: '',
      },
    };

    this.handleClearForm = this.handleClearForm.bind(this);
    if (authenticationService.currentUserValue) {
      this.props.history.push('items-list');
    }
  }
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
  handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    this.validate(name, value);
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
      case 'password':
        formErrors.password = value.length < 6 ? `${t('logIn.error.password')}` : '';
        break;
      case 'username':
        formErrors.username = value.length < 6 ? `${t('logIn.error.username')}` : '';
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value } /*, () => console.log(this.state));*/);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.validateForm(this.state);

    if (!formValid(this.state)) {
      console.info('Invalid Form');
      return;
    }
    let { t } = this.props;

    event = authenticationService
      .login(this.state.username, this.state.password)
      .then((event) => {
        // this.props.history.push('/items-list');

        window.location.href = '/items-list';
        if (event.status === 400) {
          swal(`${t('logIn.swal.errorIcon')}`, `${t('logIn.swal.errorText')}`, `${t('logIn.swal.error')}`, { button: `${t('itemList.swal.ok')}` });
        }
      })
      .catch((error) => {
        console.error(' registration error:', error.response);
        if (error.response && error.response.data.key) {
          this.validate(error.response.data.key);
          swal(`${t('logIn.swal.errorIcon')}`, `${t('logIn.swal.errorText')}`, `${t('logIn.swal.error')}`, { button: `${t('itemList.swal.ok')}` });
        } else {
          swal(`${t('logIn.swal.errorIcon')}`, `${t('logIn.swal.errorText')}`, `${t('logIn.swal.error')}`, { button: `${t('itemList.swal.ok')}` });
        }
      });
    console.log('username = ' + this.state.username, 'password= ' + this.state.password);
  };
  handleClearForm(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      password: '',
      username: '',
      formErrors: {
        password: '',
        username: '',
      },
    });
  }

  render(RESET) {
    const { formErrors } = this.state;
    const { t } = this.props;
    const ForgetPassword = withRouter(({ history }) => (
      <Button
        style={{ padding: '25px' }}
        outline="false"
        onClick={() => {
          history.push('/forgot-password');
        }}
      >
        {t('forgotPassword.forgotPassword')}
      </Button>
    ));
    const Registery = withRouter(({ history }) => (
      <Button
        outline="false"
        onClick={() => {
          history.push('/registery');
        }}
      >
        {t('navBar.signUp')} <CreateIcon />
      </Button>
    ));
    return (
      <div className="container">
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
            <div className="alertLogin">
              <Alert
                severity="info"
                color="success"
                style={{
                  color: '#00264d',
                  fontSize: '20px',
                  textAlign: 'left',
                  top: '13vh',
                }}
              >
                <AlertTitle
                  style={{
                    color: '#00264d',
                    fontSize: '20px',
                    textAlign: 'left',
                    top: '13vh',
                  }}
                >
                  <div className="converstationStrong1">{t('logIn.putYoursUsernameAndPassword')}</div>
                </AlertTitle>
              </Alert>
              <Alert
                severity="info"
                color="success"
                style={{
                  color: '#00264d',
                  fontSize: '20px',
                  textAlign: 'left',
                  top: '13vh',
                }}
              >
                <AlertTitle
                  style={{
                    color: '#00264d',
                    fontSize: '20px',
                    textAlign: 'left',
                    top: '13vh',
                  }}
                >
                  <div className="converstationStrong1">{t('logIn.forgotPassword')}</div>
                </AlertTitle>
              </Alert>
            </div>
          )}
        </div>

        <div className="form-wrapper">
          <div className="h1LogIn" style={{ backgroundColor: this.state.defaultColor }}>
            {t('logIn.title')}
          </div>

          <form onSubmit={this.handleSubmit}>
            <div className="username">
              <TextField className={formErrors.username.length > 0 ? 'error' : null} label={t('logIn.username')} type="username" required name="username" noValidate onChange={this.handleChange} />

              {formErrors.username.length > 0 && <span className="errorMessage">{formErrors.username}</span>}
            </div>
            <div className="password">
              <TextField className={formErrors.password.length > 0 ? 'error' : null} label={t('logIn.password')} type="password" required name="password" noValidate onChange={this.handleChange} />

              {formErrors.password.length > 0 && <span className="errorMessage">{formErrors.password}</span>}
            </div>

            <div className="login">
              <Button type="submit">
                {t('logIn.login')} <VpnKeyIcon>{t('logIn.login')}</VpnKeyIcon>
              </Button>
              <div className="registerLogIn">
                <Registery />
              </div>
              <div
                className="forgotPasswordStyle1"
                style={{
                  textAlign: 'center',
                }}
              >
                <ForgetPassword />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withTranslation()(Login);
