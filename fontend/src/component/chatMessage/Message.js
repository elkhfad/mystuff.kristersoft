import React, { Component } from 'react';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { Button } from '@material-ui/core';
import swal from 'sweetalert';
import Tooltip from '@material-ui/core/Tooltip';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { Input } from 'reactstrap';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import { Alert, AlertTitle } from '@material-ui/lab';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';
import CircularProgress from '@material-ui/core/CircularProgress';
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
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
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSerial: '',
      subject: '',
      isActive: false,
      loading: false,
      fileName: '',
      defaultColor: '#00264d',
      message: {
        picture: '',
        message: '',
        email: '',
      },
      formErrors: {
        itemSerial: '',
        subject: '',
        message: {
          message: '',
          email: '',
        },
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  }

  delete = () => {
    let { t } = this.props;

    swal({
      title: `${t('general.areYouSure')}`,
      icon: 'warning',
      buttons: {
        cancel: `${t('general.cancel')}`,
        ok: `${t('general.ok')}`,
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          text: `${t('general.success')}`,
          icon: 'success',
          button: `${t('itemList.swal.ok')}`,
        });

        this.setState({ picture: '' });
        this.setState({ fileName: '' });
      } else {
        swal(`${t('general.text2')}`);
      }
    });
  };
  handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    this.validate(name, value);
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
        formErrors.message.email = emailRegex.test(value) ? '' : `${t('message.error.email')}`;
        break;
      case 'itemSerial':
        formErrors.itemSerial = value.length < 5 ? `${t('message.error.itemSerial')}` : '';
        break;
      case 'message':
        formErrors.message.message = value.length < 20 ? `${t('message.error.message')}` : '';
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
    const url = '/api/noauth/itemHasBeenFounds';
    const data = {
      itemSerial: this.state.itemSerial,
      subject: this.state.subject,
      fileName: this.state.fileName,
      message: {
        picture: this.state.picture,
        email: this.state.email,
        message: this.state.message,
      },
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
      itemSerial: '',
      subject: '',
      fileName: '',
      loading: false,
      message: {
        picture: '',
        message: '',
        email: '',
      },
      formErrors: {
        itemSerial: '',
        subject: '',
        message: {
          message: '',
          email: '',
        },
      },
    });
  }
  fileChangedHandler(event) {
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
      this.setState({ fileName: event.target.files[0].name });
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          'JPEG',
          100,
          0,
          (pic) => {
            console.log(pic);
            this.setState({ picture: pic });
          },
          'base64',
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
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
              <Alert severity="info" color="success">
                <AlertTitle>
                  <div className="converstationStrong1">{t('message.weDoNotShare')}</div>
                </AlertTitle>
              </Alert>
              <Alert severity="info" color="success">
                <AlertTitle>
                  <div className="converstationStrong1">{t('message.weSendSerialNumber')}</div>
                </AlertTitle>
              </Alert>
              <Alert severity="warning" color="error">
                <AlertTitle>
                  <div className="converstationStrong3">{t('register.fillOut')}</div>
                </AlertTitle>
              </Alert>
            </div>
          )}
        </div>

        <div className="form-wrapper">
          <form onSubmit={this.handleSubmit} id="formMessage">
            <div className="message">
              <div>
                {(() => {
                  return (
                    <div>
                      <div className="h1LogIn" style={{ backgroundColor: sessionStorage.getItem('currentUser') !== null ? sessionStorage.getItem('defaultColorStore') : this.state.defaultColor }}>
                        {t('message.title')}
                      </div>

                      {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}

                      <div className="h1LogIn1" style={{ backgroundColor: sessionStorage.getItem('currentUser') !== null ? sessionStorage.getItem('defaultColorStore') : this.state.defaultColor }}>
                        <Exit />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {this.state.errorMessage && <h3 className="error"> {this.state.errorMessage} </h3>}
              <div className="itemSerial">
                <TextField
                  label={t('message.itemSerial')}
                  style={{ color: '#000000', fontSize: '20px', width: '100%' }}
                  type="text"
                  name="itemSerial"
                  required
                  validate="true"
                  onChange={this.handleChange}
                />
                {formErrors.itemSerial.length > 0 && <span className="errorMessage">{formErrors.itemSerial}</span>}
              </div>

              <div className="email">
                <TextField label={t('message.email')} style={{ color: '#000000', fontSize: '20px', width: '100%' }} type="email" name="email" required validate="true" onChange={this.handleChange} />

                {formErrors.message.email?.length > 0 && <span className="errorMessage">{formErrors.message.email}</span>}
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
                  inputProps={{ maxLength: 30 }}
                />

                {formErrors.subject.length > 0 && <span className="errorMessage">{formErrors.subject}</span>}
              </div>
              <div className="picture">
                <Input
                  type="file"
                  id="image"
                  style={{ display: 'none', color: '#000000', fontSize: '60px', border: 'none' }}
                  inputprops={{ display: 'none', accept: 'image/*, .xlsx, .xls, .csv, .pdf, .pptx, .pptm, .ppt' }}
                  name="originalFileName"
                  onChange={this.fileChangedHandler}
                />
                <label htmlFor="image">
                  <Tooltip title={<div className="toolpin ">{t('itemInput.attachment')}</div>} placement="top">
                    <Button style={{ color: '#3ac162', border: 'none' }} aria-label="upload picture" component="span">
                      <AttachmentIcon /> <div style={{ color: '#3ac162', fontSize: '14px' }}>{`${this.state.fileName}`} </div>
                    </Button>
                  </Tooltip>
                  <div className="float-right">
                    {(() => {
                      if (this.state.fileName === null || this.state.fileName === '') {
                        return;
                      }
                      if (this.state.fileName.length !== null) {
                        return (
                          <div>
                            <Tooltip title={<div className="toolpin "> {t('general.delete')}</div>} placement="top">
                              <Button
                                onClick={() => {
                                  this.delete();
                                }}
                              >
                                <ClearIcon />
                              </Button>
                            </Tooltip>
                            <img
                              style={{
                                borderWidth: 5,
                                height: 100,
                                width: 200,
                              }}
                              src={this.state.picture}
                              alt=""
                            />
                          </div>
                        );
                      }
                    })()}
                  </div>
                </label>
              </div>
              <div className="message">
                <Input
                  className={formErrors.message.message?.length > 19 ? 'error' : null}
                  placeholder={t('message.message')}
                  type="textarea"
                  name="message"
                  required
                  validate="true"
                  onChange={this.handleChange}
                  minLength={20}
                  maxLength={250}
                  style={{ color: '#000000', fontSize: '20px' }}
                />

                {formErrors.message.message?.length > 19 && <span className="errorMessage">{formErrors.message.message}</span>}
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
export default withTranslation()(Message);
