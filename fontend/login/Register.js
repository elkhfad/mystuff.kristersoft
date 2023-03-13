import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import TextField from '@material-ui/core/TextField';
import CreateIcon from '@material-ui/icons/Create';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { withTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Alert, AlertTitle } from '@material-ui/lab';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
const passRegex = RegExp(/^(?=.*[A-Za-z_@./#&+-€?<>!])(?=.*\d)[A-Za-z\d_@./#&+-€?<>!]{8,}$/);

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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isActive: false,
      defaultColor: '#00264d',
      hidden: true,
      confirmPassword: '',
      username: '',
      loading: false,
      formErrors: {
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        nonUniqueEmail: '',
        nonUniqueUsername: '',
        passR: '',
      },
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
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
  handleSuccessfulAuth(data) {
    this.props.handleLogin(data);
  }
  registerOk = () => {
    let { t } = this.props;

    swal({
      title: `${t('register.swal.thankYouForRegister')}`,
      text: `${t('register.swal.sendYouMessage')}`,
      icon: 'success',
      button: {
        ok: `${t('itemList.swal.ok')}`,
      },
    }).then((okRegister) => {
      if (okRegister) {
        this.props.history.push('/login');
      }
    });
  };
  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }
  componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    if (this.props.confirmPassword) {
      this.setState({ confirmPassword: this.props.confirmPassword });
    }
  }
  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.clearError(name);
    this.validate(name, value);
    this.setState({ [name]: value });
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
    let { t } = this.props;
    let formErrors = this.state.formErrors;
    switch (name) {
      case 'email':
        formErrors.email = emailRegex.test(value) ? '' : `${t('register.error.email')}`;
        break;

      case 'nonUniqueEmail':
        formErrors.nonUniqueEmail = value || '';
        break;
      case 'password':
        formErrors.password = passRegex.test(value) ? '' : `${t('register.error.passRegex')}`;
        formErrors.confirmPassword = value !== this.state.confirmPassword ? `${t('register.error.confirmPassword')}` : '';
        break;
      case 'confirmPassword':
        formErrors.confirmPassword = this.state.password !== value ? `${t('register.error.confirmPassword')}` : '';
        break;
      case 'username':
        formErrors.username = value.length < 6 ? `${t('register.error.username')}` : '';
        break;
      case 'nonUniqueUsername':
        formErrors.nonUniqueUsername = value || '';
        break;
      default:
        break;
    }
    this.setState({ formErrors });
  };

  clearError = (name) => {
    const errors = this.state.formErrors;
    switch (name) {
      case 'email':
        errors.nonUniqueEmail = '';
        this.setState({ formErrors: errors });
        break;
      case 'username':
        errors.nonUniqueUsername = '';
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

    //event.target.reset();
    //this.props.history.push('/login');
    this.setState({ loading: true });
    const url = '/api/auth/signup';

    const data = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
      confirmPassword: this.state.confirmPassword,
    };

    let { t } = this.props;
    axios
      .post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.status === 200) {
          //this.handleSuccessfulAuth(res.data);
          this.setState({ loading: false });

          this.registerOk();
        }
        if (res.status === 201) {
          //this.handleSuccessfulAuth(res.data);
          this.setState({ loading: false });

          this.registerOk();
        }
        if (res.status === 400) {
          //this.handleSuccessfulAuth(res.data);
          swal(`${t('register.swal.errorIcon')}`, `${t('register.swal.errorText')}`, `${t('register.swal.error')}`);
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        console.error(' registration error:', error.response);
        if (error.response && error.response.data.key) {
          const data = error.response.data;
          this.validate(data.key, data.message);
          swal(`${t('register.swal.errorIcon')}`, `${t('register.swal.errorSubmiting')}`, `${t('register.swal.error')}`);
          this.setState({ loading: false });
        } else {
          swal(`${t('register.swal.errorIcon')}`, `${t('register.swal.errorSubmiting')}`, `${t('register.swal.error')}`);
          this.setState({ loading: false });
        }
      });
  };

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
            <div>
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
                  <div className="converstationStrong1">{t('register.weSend')}</div>
                </AlertTitle>
              </Alert>
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
                  <div className="converstationStrong1">{t('register.weDoNotShare')}</div>
                </AlertTitle>
              </Alert>
              <Alert
                severity="warning"
                color="error"
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
                  <div className="converstationStrong3">{t('register.fillOut')}</div>
                </AlertTitle>
              </Alert>
              <Alert
                severity="warning"
                color="error"
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
                  <div className="converstationStrong3">{t('register.usernameCannotBechange')}</div>
                </AlertTitle>
              </Alert>
            </div>
          )}
        </div>

        <div className="form-wrapper">
          <div>
            {(() => {
              return (
                <div className="h1LogIn" style={{ backgroundColor: sessionStorage.getItem('currentUser') !== null ? sessionStorage.getItem('defaultColorStore') : this.state.defaultColor }}>
                  {t('register.title')}{' '}
                  <div className="h1LogIn1" sstyle={{ backgroundColor: sessionStorage.getItem('currentUser') !== null ? sessionStorage.getItem('defaultColorStore') : this.state.defaultColor }}>
                    <Exit />
                  </div>
                </div>
              );
            })()}
          </div>

          {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}

          <form onSubmit={this.handleSubmit} validate="true">
            <div className="email">
              <TextField
                className={formErrors.email.length > 0 ? 'error' : null}
                label={t('register.email')}
                type="email"
                required
                name="email"
                validate="true"
                onChange={this.handleChange}
                style={{ color: '#000000', fontSize: '20px', width: '100%' }}
              />

              {formErrors.email.length > 0 && <span className="errorMessage">{formErrors.email}</span>}
              {formErrors.nonUniqueEmail.length > 0 && <span className="errorMessage">{formErrors.nonUniqueEmail}</span>}
            </div>
            <div className="username">
              <TextField
                className={formErrors.username.length > 0 ? 'error' : null}
                label={t('register.username')}
                type="username"
                required
                name="username"
                inputProps={{ maxLength: 30 }}
                validate="true"
                onChange={this.handleChange}
                style={{ color: '#000000', fontSize: '20px', width: '100%' }}
              />

              {formErrors.username.length > 0 && <span className="errorMessage">{formErrors.username}</span>}
              {formErrors.nonUniqueUsername.length > 0 && <span className="errorMessage">{formErrors.nonUniqueUsername}</span>}
            </div>
            <div className="password">
              <TextField
                className={formErrors.password.length > 0 ? 'error' : null}
                label={t('register.password')}
                type={this.state.hidden ? 'password' : 'text'}
                value={this.state.password}
                onChange={this.handleChange}
                name="password"
                required
                validate="true"
                style={{ color: '#000000', fontSize: '20px', width: '70%' }}
              />
              <Button onClick={this.toggleShow}>
                {(() => {
                  if (this.state.hidden === true) {
                    return <VisibilityIcon />;
                  }
                  if (this.state.hidden === false) {
                    return <VisibilityOffIcon />;
                  }
                })()}
              </Button>

              {formErrors.password.length > 0 && <span className="errorMessage">{formErrors.password}</span>}
            </div>

            <div className="confirmPassword">
              <TextField
                className={formErrors.confirmPassword.length > 0 ? 'error' : null}
                label={t('register.confirmPassword')}
                type={this.state.hidden ? 'password' : 'text'}
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                name="confirmPassword"
                required
                validate="true"
                style={{ color: '#000000', fontSize: '20px', width: '100%' }}
              />

              {formErrors.confirmPassword.length > 0 && <span className="errorMessage">{formErrors.confirmPassword}</span>}
            </div>

            <div className="createAccount">
              <Button type="submit" style={{ width: '100%' }}>
                {t('register.create')} <CreateIcon>{t('register.create')}</CreateIcon>
                {this.state.loading ? <CircularProgress /> : null}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withTranslation()(Register);
