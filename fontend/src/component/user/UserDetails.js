import React from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import UserDetailUpdatePassword from './UserDetailUpdatePassword';
import UserDetailUpdateEmail from './UserDetailUpdateEmail';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Label, Input } from 'reactstrap';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { authHeader } from '../../authentication/AuthHeader';
import PaletteIcon from '@material-ui/icons/Palette';
import SaveIcon from '@material-ui/icons/Save';
import swal from 'sweetalert';
import Tooltip from '@material-ui/core/Tooltip';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import Switch from '@mui/material/Switch';

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.user = {};
    this.state = {
      users: [],
      isTable: false,
      isDefaultColor: false,
      isActive: false,
      color: '',
      defaultColor: '',
      formErrors: {
        name: '',
        email: '',
        username: '',
        password: '',
        nonUniqueEmail: '',
        nonUniqueUsername: '',
      },
    };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUsersIsDefaultColor = this.fetchUsersIsDefaultColor.bind(this);
  }
  fetchUsersIsDefaultColor = () => {
    axios.get(`/api/users/defaultColor`, { headers: authHeader() }).then((res) => {
      this.setState({ defaultColor: res.data });
      sessionStorage.setItem('defaultColorStore', this.state.defaultColor);
    });
  };
  async componentDidMount() {
    await this.fetchUsers();
    await this.fetchUsersIsDefaultColor();
    if (this.props.color) {
      this.setState({ color: this.props.color });
    }
  }
  checkbox = (e) => {
    this.setState({ isTable: !this.state.isTable });
  };
  checkboxDefault = (e) => {
    this.setState({ isDefaultColor: !this.state.isDefaultColor });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
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
      sessionStorage.setItem('defaultColorStore', this.state.defaultColor);
      this.user = res.data;
    });
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
  componentDidUpdate(prevProps) {
    if (prevProps.users !== this.props.users) {
      this.fetchUsers();
    }
  }
  delete = (id) => {
    let { t } = this.props;

    swal({
      title: `${t('userDetailDelete.areYouSure')}`,
      text: `${t('userDetailDelete.text')}`,
      icon: 'warning',
      buttons: {
        cancel: `${t('userDetailDelete.no')}`,
        ok: `${t('userDetailDelete.yes')}`,
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          text: `${t('itemList.swal.success')}`,
          icon: 'warning',

          button: `${t('itemList.swal.ok')}`,
        });

        axios.delete(`/api/users/${id}`, { headers: authHeader() }).then((res) => {
          swal({
            text: `${t('itemList.swal.success')}`,
            icon: 'success',
            button: `${t('itemList.swal.ok')}`,
          }).then(function () {
            window.location.reload();
            sessionStorage.removeItem('currentUser');
          });
        });
      } else {
        swal(`${t('userDetailDelete.text2')}`, { button: `${t('itemList.swal.ok')}` });
      }
    });
  };
  getRandomColor = () => {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
      this.setState({ color: color });
    }
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
      case 'name':
        formErrors.name = value.length < 3 ? `${t('userDetails.error.name')}` : '';
        break;

      case 'password':
        formErrors.password = value.length < 6 ? `${t('userDetails.error.password')}` : '';
        break;

      case 'email':
        formErrors.email = emailRegex.test(value) ? '' : `${t('userDetails.error.email')}`;
        break;
      case 'username':
        formErrors.username = value.length < 6 ? `${t('userDetails.error.username')}` : '';
        break;
      case 'nonUniqueEmail':
        formErrors.nonUniqueEmail = value || '';
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
      isDefaultColor: this.state.isDefaultColor,
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
    const Exit = withRouter(({ history }) => (
      <Button
        outline="true"
        onClick={() => {
          history.push('/items-list');
        }}
      >
        {t('userDetails.exit')} <ExitToAppIcon> {t('userDetails.exit')}</ExitToAppIcon>
      </Button>
    ));

    const Color = () => (
      <Tooltip title={<div className="toolpin"> {t('userDetails.userDetails')}</div>} placement="top" style={{ color: 'red' }}>
        <Button outline="true" onClick={this.getRandomColor} style={{ marginLeft: '210px', marginTop: '-50px' }}>
          <PaletteIcon style={{ marginRight: '10px', color: `${this.state.color}` }}></PaletteIcon>
        </Button>
      </Tooltip>
    );
    const Delete = () => (
      <Button
        onClick={() => {
          this.delete(this.user.id);
        }}
        style={{ width: '100%', textAlign: 'center' }}
      >
        <div className="userDetailDelete">{t('userDetailDelete.delete')}</div>
        <div className="userDetailDeleteIcon">
          <NoAccountsIcon className="userDetailDeleteIcon" />
        </div>
      </Button>
    );

    return (
      <div className="container">
        <div className="alertUserDetail">
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
                    <div class="converstationStrong1">{t('userDetails.update')}</div>
                  </AlertTitle>
                </Alert>
              </div>
            )}
          </div>
        </div>
        <div className="form-wrapper">
          <div>
            <div className="h1LogIn" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
              {t('userDetails.title')}
            </div>
            <div className="h1LogIn1" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
              <Exit />
            </div>
          </div>

          {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}

          {formErrors.name.length > 0 && <span className="errorMessage">{formErrors.name}</span>}

          <Label for="password">
            {t('userDetails.password')}
            <div className="float-right">
              <UserDetailUpdatePassword fetchUsers={this.fetchUsers} style={{ fontSize: '20px' }} />
            </div>
          </Label>
          <Input
            className={formErrors.password.length > 0 ? 'error' : null}
            type="password"
            disabled
            minLength={8}
            noValidate
            defaultValue={this.state.users.password}
            name="password"
            onChange={this.handleChange}
            style={{
              color: '#000000',
              fontSize: '14px',
            }}
          />

          <Label for="email">
            {t('userDetails.email')}
            <div className="float-right">
              <UserDetailUpdateEmail fetchUsers={this.fetchUsers} />
            </div>
          </Label>
          <Input
            className={formErrors.email.length > 0 ? 'error' : null}
            required
            type="email"
            noValidate
            disabled
            name="email"
            defaultValue={this.state.users.email}
            onChange={this.handleChange}
            style={{
              color: '#000000',
              fontSize: '14px',
            }}
          />

          <form onSubmit={this.handleSubmit} validate="true">
            {formErrors.name.length > 0 && <span className="errorMessage">{formErrors.name}</span>}
            <Label for="username">{t('userDetails.username')}</Label>
            <Input
              className={formErrors.username.length > 0 ? 'error' : null}
              required
              type="text"
              noValidate
              defaultValue={this.state.users.username}
              name="username"
              readOnly
              disabled
              style={{
                color: '#000000',
                fontSize: '14px',
              }}
            />

            {formErrors.username.length > 0 && <span className="errorMessage">{formErrors.username}</span>}
            {formErrors.nonUniqueUsername.length > 0 && <span className="errorMessage">{formErrors.nonUniqueUsername}</span>}
            <div className="textColor1">
              <select
                name="color"
                onChange={this.handleChange}
                style={{
                  color: '#ffffffff',
                  backgroundColor: this.state.color,
                  fontSize: '16px',
                  width: '200px',
                }}
              >
                <option value={this.user.color}>{t('userDetails.color')}</option>
                <option className="redOption" value="#ab0000" background-color="#ab0000" name={t('color.red')}>
                  {t('color.red')}
                </option>
                <option className="blueOption" value="#0021FF" background-color="#0021FF" name={t('color.blue')}>
                  {t('color.blue')}
                </option>
                <option className="pinkOption" value="#ff308a" background-color="#ff308a" name={t('color.orange')}>
                  {t('color.pink')}
                </option>
                <option className="orangeOption" value="#fc921a" background-color="#fc921a" name={t('color.red')}>
                  {t('color.orange')}
                </option>
                <option className="greyOption" value="#4a5454" background-color="#4a5454" name={t('color.grey')}>
                  {t('color.grey')}
                </option>
                <option className="yellowOption" value="#FFD333" background-color="#FFD333" name={t('color.yellow')}>
                  {t('color.yellow')}
                </option>
                <option className="greenOption" value="#0F7D0B" background-color="#0F7D0B" name={t('color.green')}>
                  {t('color.green')}
                </option>
                <option className="blackOption" value="#000000" background-color="#000000" name={t('color.black')}>
                  {t('color.black')}
                </option>
                <option className="brawnkOption" value="#b3641b" background-color="#b3641b" name={t('color.brawn')}>
                  {t('color.brawn')}
                </option>
              </select>

              <Color />
            </div>
            <div className="isItTable">
              {t('userDetails.table')}
              <Switch checked={this.state.isTable} style={{ color: '#6fbf73' }} onChange={this.checkbox} inputProps={{ 'aria-label': 'controlled' }} />
            </div>
            <div className="isItTable">
              {t('userDetails.isDefaultColor')}
              <Switch checked={this.state.isDefaultColor} style={{ color: '#6fbf73' }} onChange={this.checkboxDefault} inputProps={{ 'aria-label': 'controlled' }} />
            </div>
            <div className="deleteKort12">
              <Delete />
            </div>
            <div className="userDetails">
              <Button outline="true" style={{ width: '100%' }} type="submit">
                {t('userDetails.save')} <SaveIcon>{t('userDetails.save')}</SaveIcon>
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withTranslation()(UserDetails);
