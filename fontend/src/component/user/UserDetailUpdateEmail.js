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
import { Label, Input } from 'reactstrap';
import { authHeader } from '../../authentication/AuthHeader';
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
class UserDetailUpdateEmail extends React.Component {
  constructor(props) {
    super(props);
    this.user = {};
    this.state = {
      confirmPassword: '',
      open: false,
      defaultColor: '',
      users: [],
      formErrors: {
        email: '',
        nonUniqueEmail: '',
      },
    };
    this.handleClearForm = this.handleClearForm.bind(this);
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
  handleClearForm(e) {
    if (e) {
      e.preventDefault();
    }
    document.getElementById('form').reset();

    this.setState({
      confirmPassword: '',
      users: [],
      formErrors: {
        email: '',
        nonUniqueEmail: '',
      },
    });
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
    let formErrors = this.state.formErrors;
    switch (name) {
      case 'nonUniqueEmail':
        formErrors.nonUniqueEmail = value || '';
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
          <Tooltip title={<div className="toolpin ">{t('userDetailUpdateEmail.title')}</div>} placement="top">
            <Button onClick={this.handleClickOpen}>
              <UpdateIcon />
            </Button>
          </Tooltip>
        </div>

        <Dialog open={this.state.open} aria-labelledby="form-dialog-title">
          <div className="h1LogIn" style={{ backgroundColor: this.state.defaultColor }}>
            {t('userDetailUpdateEmail.title')}
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
            <Label for="email">{t('userDetails.email')}</Label>
            <Input
              className={formErrors.email.length > 0 ? 'error' : null}
              type="email"
              noValidate
              defaultValue={this.state.users.email}
              name="email"
              onChange={this.handleChange}
              style={{ color: '#000000', fontSize: '20px', width: '100%' }}
            />
            {formErrors.email.length > 0 && <span className="errorMessage">{formErrors.email}</span>}
            {formErrors.nonUniqueEmail.length > 0 && <span className="errorMessage">{formErrors.nonUniqueEmail}</span>}

            <Button outline="true" type="submit" style={{ width: '100%' }}>
              {t('userDetails.save')} <SaveIcon>{t('userDetails.save')}</SaveIcon>
            </Button>
          </form>
        </Dialog>
      </div>
    );
  }
}
export default withTranslation()(UserDetailUpdateEmail);
