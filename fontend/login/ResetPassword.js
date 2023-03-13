import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import TextField from '@material-ui/core/TextField';
import CreateIcon from '@material-ui/icons/Create';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { withTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
const passRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  //validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });
  //validate the form was filled out
  Object.values(rest).forEach((val) => {});

  return valid;
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      defaultColor: '#00264d',
      hidden: true,
      confirmPassword: '',
      token: this.resetPasswordToken(props),

      formErrors: {
        password: '',
        confirmPassword: '',
      },
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }
  handleSuccessfulAuth(data) {
    this.props.handleLogin(data);
  }

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
      case 'password':
        formErrors.password = passRegex.test(value) ? '' : `${t('register.error.passRegex')}`;
        formErrors.confirmPassword = value !== this.state.confirmPassword ? `${t('register.error.confirmPassword')}` : '';
        break;
      case 'confirmPassword':
        formErrors.confirmPassword = this.state.password !== value ? `${t('register.error.confirmPassword')}` : '';
        break;

      default:
        break;
    }
    this.setState({ formErrors });
  };
  resetPasswordToken(props) {
    const search = props.location?.search;
    const indexOfAuthStart = props.location?.search?.indexOf('token=');
    if (indexOfAuthStart < 0) {
      return;
    }

    let authString = search.substring(indexOfAuthStart, search.length);
    authString = authString.replace('token=', '');
    const lastIndex = authString.indexOf('&') < 0 ? search.length : authString.indexOf('&');
    authString = authString.substring(authString, lastIndex);
    return authString;
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.validateForm(this.state);
    if (!formValid(this.state)) {
      console.info('Invalid Form');
      return;
    }

    //event.target.reset();
    //this.props.history.push('/login');
    const url = '/reset_password';

    const data = { password: this.state.password, token: this.state.token };
    let { t } = this.props;
    axios
      .post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.status === 200) {
          //this.handleSuccessfulAuth(res.data);
          this.props.history.push('/login');
        }
        if (res.status === 201) {
          //this.handleSuccessfulAuth(res.data);

          this.props.history.push('/login');
        }
        if (res.status === 400) {
          //this.handleSuccessfulAuth(res.data);
          swal(`${t('register.swal.errorIcon')}`, `${t('register.swal.errorText')}`, `${t('register.swal.error')}`);
        }
      })
      .catch((error) => {
        console.error(' registration error:', error.response);
        if (error.response && error.response.data.key) {
          const data = error.response.data;
          this.validate(data.key, data.message);
          swal(`${t('register.swal.errorIcon')}`, `${t('register.swal.errorSubmiting')}`, `${t('register.swal.error')}`);
        } else {
          swal(`${t('register.swal.errorIcon')}`, `${t('register.swal.errorSubmiting')}`, `${t('register.swal.error')}`);
        }
      });
  };

  render() {
    const { formErrors } = this.state;
    const { t } = this.props;
    return (
      <div className="container">
        <div className="form-wrapper">
          <div className="h1LogIn" style={{ backgroundColor: this.state.defaultColor }}>
            {t('resetPassword.title')}
          </div>
          {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}

          <form onSubmit={this.handleSubmit} validate="true">
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
                style={{ color: '#000000', fontSize: '20px', width: '75%' }}
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
              <Button type="submit">
                {t('resetPassword.newPassword')} <CreateIcon>{t('resetPassword.newPassword')}</CreateIcon>
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withTranslation()(ResetPassword);
