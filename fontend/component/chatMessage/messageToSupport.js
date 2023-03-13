import React, { Component } from 'react';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { Button } from '@material-ui/core';
import swal from 'sweetalert';
import { Input } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });
  return valid;
};
class MessageToSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      isActive: false,
      loading: false,
      fileName: '',
      defaultColor: '#00264d',
      message: '',
      email: '',
      formErrors: {
        subject: '',
        message: '',
        email: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
      case 'email':
        formErrors.email = emailRegex.test(value) ? '' : `${t('message.error.email')}`;
        break;
      case 'message':
        formErrors.message = value.length < 20 ? `${t('message.error.message')}` : '';
        break;
      case 'subject':
        formErrors.subject = value.length < 3 ? `${t('message.error.subject')}` : '';
        break;
      default:
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
    const url = '/api/noauth/support';
    const data = {
      subject: this.state.subject,
      email: this.state.email,
      message: this.state.message,
    };

    let { t } = this.props;
    axios
      .post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            text: `${t('message.swal.success')}`,
            icon: 'success',
            button: `${t('itemList.swal.ok')}`,
          });
          this.handleClearForm();
        }
        if (res.status === 400) {
          this.props.handle.handleSuccessfulAuth(res.data);
          swal(`${t('message.swal.errorIcon')}`, `${t('message.swal.errorText')}`, `${t('message.swal.error')}`);
        }
      })
      .catch((error) => {
        console.error(' message error:', error.response);
        if (error.response && error.response.data.key) {
          this.validate(error.response.data.key);
          swal(`${t('message.swal.errorIcon')}`, `${t('message.swal.errorText')}`, `${t('message.swal.error')}`);
        } else {
          swal(`${t('message.swal.errorIcon')}`, `${t('message.swal.errorText')}`, `${t('message.swal.error')}`);
        }
      });
  };

  handleClearForm(e) {
    if (e) {
      e.preventDefault();
    }
    document.getElementById('formMessage').reset();
    this.setState({
      subject: '',
      fileName: '',
      loading: false,
      message: '',
      email: '',
      formErrors: {
        subject: '',
        message: '',
        email: '',
      },
    });
  }
  render() {
    const { formErrors } = this.state;
    const { t } = this.props;

    return (
      <div className="container">
        <div className="form-wrapper">
          <form onSubmit={this.handleSubmit} id="formMessage">
            <div className="message">
              <div>
                {(() => {
                  return (
                    <div>
                      <div className="h1LogIn" style={{ backgroundColor: sessionStorage.getItem('currentUser') !== null ? sessionStorage.getItem('defaultColorStore') : this.state.defaultColor }}>
                        {t('messageToSupport.title')}
                      </div>

                      {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}
                    </div>
                  );
                })()}
              </div>

              <div className="email">
                <TextField label={t('message.email')} style={{ color: '#000000', fontSize: '20px', width: '100%' }} type="email" name="email" required validate="true" onChange={this.handleChange} />

                {formErrors.email?.length > 0 && <span className="errorMessage">{formErrors.email}</span>}
              </div>

              <div className="subject">
                <TextField
                  label={t('message.subject')}
                  type="text"
                  name="subject"
                  required
                  validate="true"
                  style={{ color: '#000000', fontSize: '20px', width: '100%' }}
                  onChange={this.handleChange}
                />

                {formErrors.subject.length > 0 && <span className="errorMessage">{formErrors.subject}</span>}
              </div>
              <div className="message">
                <Input
                  className={formErrors.message?.length > 19 ? 'error' : null}
                  placeholder={t('message.messageToSupport')}
                  type="textarea"
                  name="message"
                  required
                  validate="true"
                  onChange={this.handleChange}
                  minLength={20}
                  maxLength={1500}
                  style={{ color: '#000000', fontSize: '20px' }}
                />

                {formErrors.message?.length > 19 && <span className="errorMessage">{formErrors.message}</span>}
              </div>
            </div>

            <div className="Send message">
              <Button type="submit" style={{ width: '100%' }} endIcon={<SendIcon> {t('message.send')}</SendIcon>}>
                {t('message.send')}
                {this.state.loading ? <CircularProgress /> : null}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withTranslation()(MessageToSupport);
