import React from 'react';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import { Button } from '@material-ui/core';
import swal from 'sweetalert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import UpdateIcon from '@material-ui/icons/Update';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { authHeader } from '../../authentication/AuthHeader';
import TextField from '@material-ui/core/TextField';

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
class userDetailUpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.user = {};
    this.state = {
      open: false,
      hidden: true,
      confirmPassword: '',
      defaultColor: '',
      users: [],
      formErrors: {
        confirmPassword: '',
        password: '',
      },
    };
    this.handleClearForm = this.handleClearForm.bind(this);
    this.toggleShow = this.toggleShow.bind(this);

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUsersdefaultColor = this.fetchUsersdefaultColor.bind(this);
  }
  fetchUsersdefaultColor = () => {
    axios.get(`/api/users/defaultColor`, { headers: authHeader() }).then((res) => {
      this.setState({ defaultColor: res.data });
    });
  };
  handleHide = () => {
    this.setState({
      isActive: false,
    });
  };
  handleClearForm(e) {
    if (e) {
      e.preventDefault();
    }
    document.getElementById('form').reset();

    this.setState({
      confirmPassword: '',
      password: '',
      users: [],
      formErrors: {
        confirmPassword: '',
        password: '',
      },
    });
  }
  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== prevProps.value) {
      return this.fetchUsers();
    }
  }

  async componentDidMount() {
    await this.fetchUsers();
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    if (this.props.confirmPassword) {
      this.setState({ confirmPassword: this.props.confirmPassword });
    }
    this.fetchUsersdefaultColor();
  }

  fetchUsers = () => {
    axios.get(`/api/users`, { headers: authHeader() }).then((res) => {
      this.setState({
        users: res.data,
        confirmPassword: res.data.password,
        password: res.data.password,
        email: res.data.email,
        color: res.data.color,
        isTable: res.data.isTable,
        isDefaultColor: res.data.isDefaultColor,
        defaultColor: res.data.defaultColor,
      });

      this.user = res.data;
    });
  };

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
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  clearError = (name) => {
    const errors = this.state.formErrors;
    switch (name) {
      case 'email':
        errors.nonUniqueEmail = '';
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

    const id = this.state.users.id || this.user.id;
    const url = `/api/users/${id}`;

    const data = {
      name: this.state.name || this.user.name,
      role: this.state.role || this.user.role,
      email: this.state.email || this.user.email,
      username: this.state.username || this.user.username,
      password: this.state.password || this.user.password,
      confirmPassword: this.state.confirmPassword,
      color: this.state.color || this.user.color,
      isTable: this.state.isTable,
      isDefaultColor: this.state.isDefaultColor || this.user.isDefaultColor,
      defaultColor: this.state.defaultColor || this.user.defaultColor,
    };
    let { t } = this.props;

    this.handleClose();

    swal({
      title: `${t('userDetails.swal.title')}`,
      icon: 'warning',
      buttons: {
        cancel: `${t('userDetails.swal.dontSave')}`,
        ok: `${t('userDetails.swal.save')}`,
      },
      dangerMode: false,
    }).then((save) => {
      if (save) {
        axios.put(url, data, {
          headers: authHeader(),
        });
        swal(`${t('userDetails.swal.saved')}`, {
          icon: 'success',
        }).then(function () {
          window.location.reload();
        });
      } else {
        swal(`${t('userDetails.swal.notSaved')}`);
      }
    });
  };
  render() {
    const { formErrors } = this.state;
    const { t } = this.props;

    return (
      <div className="wrapper1">
        <div>
          <Tooltip title={<div className="toolpin ">{t('userDetailUpdatePassword.title')}</div>} placement="top">
            <Button onClick={this.handleClickOpen}>
              <UpdateIcon />
            </Button>
          </Tooltip>
        </div>

        <Dialog open={this.state.open} aria-labelledby="form-dialog-title">
          <div className="h1LogIn" style={{ backgroundColor: this.state.defaultColor }}>
            {t('userDetailUpdatePassword.title')}
            <div className="h1LogIn1" style={{ backgroundColor: this.state.defaultColor }}>
              <Button onClick={this.handleClose}>
                {t('itemInput.exit')} <ExitToAppIcon> {t('itemInput.exit')}</ExitToAppIcon>
              </Button>
            </div>
          </div>

          <form
            onSubmit={this.handleSubmit}
            validate="true"
            style={{
              color: '#000000',
              width: '400px',
            }}
          >
            <div className="password">
              <TextField
                className={formErrors.password.length > 0 ? 'error' : null}
                label={t('register.password')}
                type={this.state.hidden ? 'password' : 'text'}
                onChange={this.handleChange}
                name="password"
                required
                validate="true"
                style={{ color: '#000000', fontSize: '20px', width: '80%' }}
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
                onChange={this.handleChange}
                name="confirmPassword"
                required
                validate="true"
                style={{ color: '#000000', fontSize: '20px', width: '100%' }}
              />

              {formErrors.confirmPassword.length > 0 && <span className="errorMessage">{formErrors.confirmPassword}</span>}
            </div>

            <div className="userDetails">
              <Button outline="true" style={{ width: '100%' }} type="submit">
                {t('userDetails.save')} <SaveIcon>{t('userDetails.save')}</SaveIcon>
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    );
  }
}
export default withTranslation()(userDetailUpdatePassword);
