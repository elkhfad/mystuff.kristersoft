import React, { Component } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import { Input } from 'reactstrap';
import { Button } from '@material-ui/core';
import { authHeader } from '../authentication/AuthHeader';
import SaveIcon from '@material-ui/icons/Save';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import Tooltip from '@material-ui/core/Tooltip';
import { withTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  //validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });
  //validate the form was filled out
  /*Object.values(rest).forEach((val) => {
    (val == null || val.length === 0) && (valid = false);
  });
*/
  return valid;
};

class ItemsInput1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: '',
      loading: false,
      description: '',
      formErrors: {
        name: '',
        description: '',
      },
    };
    this.handleClearForm = this.handleClearForm.bind(this);
  }
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
      case 'name':
        formErrors.name = value.length < 3 ? `${t('itemInput.error.name')}` : '';

        break;
      case 'description':
        formErrors.description = value.length > 120 ? `${t('itemInput.error.description')}` : '';

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
    this.setState({ loading: true });

    const url = '/api/items';

    const data = {
      name: this.state.name,
      description: this.state.description,
    };
    let { t } = this.props;

    axios
      .post(url, data, {
        headers: authHeader(),
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: 'bottom',
            icon: 'success',
            title: `${t('itemInput.swal.new')}`,
            showConfirmButton: false,
            timer: 1500,
          }).then(function () {
            window.location.reload();
          });
          this.handleClearForm();
        }

        if (res.status === 500) {
          this.props.handle.handleSuccessfulAuth(res.data);
          swal(`${t('itemInput.swal.errorIcon')}`, `${t('itemInput.swal.errorText')}`, `${t('itemInput.swal.error')}`);
        }
        if (res.status === 400) {
          this.props.handle.handleSuccessfulAuth(res.data);
          swal(`${t('itemInput.swal.errorIcon')}`, `${t('itemInput.swal.errorText')}`, `${t('itemInput.swal.error')}`);
        }
      })
      .catch((error) => {
        console.error(' item error:', error.response);
        if (error.response && error.response.data.key) {
          this.validate(error.response.data.key);
          swal(`${t('itemInput.swal.errorIcon')}`, `${t('itemInput.swal.errorText')}`, `${t('itemInput.swal.error')}`);
        } else {
          swal(`${t('itemInput.swal.errorIcon')}`, `${t('itemInput.swal.errorText')}`, `${t('itemInput.swal.error')}`);
        }
      });
  };
  handleClearForm(e) {
    if (e) {
      e.preventDefault();
    }
    document.getElementById('form').reset();

    this.setState({
      name: '',
      description: '',
      loading: false,
      formErrors: {
        name: '',
        description: '',
      },
    });
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { formErrors } = this.state;
    const { t } = this.props;

    return (
      <div className="wrapper1">
        <div>
          <Tooltip title={<div className="toolpin ">{t('itemInput.title')}</div>} placement="top">
            <Button onClick={this.handleClickOpen}>
              <AddCircleIcon>{t('itemInput.add')}</AddCircleIcon>
            </Button>
          </Tooltip>
        </div>

        <Dialog open={this.state.open} aria-labelledby="form-dialog-title">
          <div className="h1LogIn" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
            {t('itemInput.new')}
            <div className="h1LogIn1" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
              <Button onClick={this.handleClose}>
                {t('itemInput.exit')} <ExitToAppIcon> {t('itemInput.exit')}</ExitToAppIcon>
              </Button>
            </div>
          </div>

          <form onSubmit={this.handleSubmit} id="form">
            <div className="name">
              <Input
                className={formErrors.name.length > 0 ? 'error' : null}
                placeholder={t('itemInput.name')}
                type="text"
                name="name"
                maxLength={20}
                required
                validate="true"
                onChange={this.handleChange}
                style={{ color: '#000000', fontSize: '20px' }}
              />

              {formErrors.name.length > 0 && <span className="errorMessage">{formErrors.name}</span>}
            </div>
            <div className="description">
              <Input
                placeholder={t('itemInput.description')}
                type="textarea"
                name="description"
                validate="true"
                onChange={this.handleChange}
                maxLength={120}
                cols={100}
                rows={50}
                style={{ color: '#000000', fontSize: '20px' }}
              />

              {formErrors.description.length > 0 && <span className="errorMessage">{formErrors.description}</span>}
            </div>

            <div className="Add Item">
              <Button type="submit" style={{ width: '100%' }}>
                {t('itemInput.save')} <SaveIcon>{t('itemInput.save')} </SaveIcon>
                {this.state.loading ? <CircularProgress /> : null}
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    );
  }
}
export default withTranslation()(ItemsInput1);
