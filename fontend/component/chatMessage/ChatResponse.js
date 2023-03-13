import axios from 'axios';
/*import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
*/
//import Paper from "@material-ui/core/Paper";
//import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import SendIcon from '@material-ui/icons/Send';
import Tooltip from '@material-ui/core/Tooltip';
import { Input } from 'reactstrap';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { Button, TextareaAutosize } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../../../src/styles/index.scss';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import swal from 'sweetalert';
import ClearIcon from '@material-ui/icons/Clear';
import Resizer from 'react-image-file-resizer';
import moment from 'moment';

class ChatResponse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      converstationChat: null,
      message: '',
      picture: '',
      fileName: '',
      defaultColor: '#00264d',
      messages: [],
      loading: false,
      auth: this.resolveAuth(props),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchConverstationChatMessages = this.fetchConverstationChatMessages.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  }

  resolveAuth(props) {
    const search = props.location?.search;
    const indexOfAuthStart = props.location?.search?.indexOf('auth=');
    if (indexOfAuthStart < 0) {
      props.history.push('/home');
      return;
    }

    let authString = search.substring(indexOfAuthStart, search.length);
    authString = authString.replace('auth=', '');
    const lastIndex = authString.indexOf('&') < 0 ? search.length : authString.indexOf('&');
    authString = authString.substring(authString, lastIndex);
    return authString;
  }

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages.length !== this.state.messages.length) {
    }
    if (prevState.currentConverstationChat !== this.state.currentPage) {
    }
    this.scrollToBottom();
  }

  componentDidMount() {
    this.fetchConverstationChatMessages();
    this.fetchConverstation();
    this.scrollToBottom();

    setInterval(() => {
      this.fetchConverstationChatMessages();
    }, 30000);
  }
  fetchConverstationChatMessages = () => {
    axios.get(`/api/urlsign/converstationServices/messages?auth=${this.state.auth}`).then((res) => {
      this.setState({ messages: res.data });
    });
  };
  fetchConverstation = () => {
    axios.get(`/api/urlsign/converstationServices/?auth=${this.state.auth}`).then((res) => {
      this.setState({ converstationChat: res.data });
    });
  };

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
  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.messageValidata(name, value);
  };
  messageValidata = (name, value) => {
    this.setState({ [name]: value } /*, () => console.log(this.state));*/);
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.messageValidata(this.state);

    const url = `/api/urlsign/converstationServices`;

    const data = {
      message: this.state.message,
      picture: this.state.picture,
      fileName: this.state.fileName,
    };

    axios.post(`${url}?auth=${this.state.auth}`, data).then((res) => {
      this.fetchConverstationChatMessages();
      this.handleClearForm();
    });
    this.setState({ picture: '' });
    this.setState({ fileName: '' });
    this.setState({ message: '' });
  };
  handleClearForm(e) {
    if (e) {
      e.preventDefault();
    }
    document.getElementById('chatformText').reset();

    this.setState({
      message: '',
      picture: '',
      fileName: '',
    });
  }

  useEffect = () => {
    const fetchPosts = async () => {
      this.setState = { loading: true };
      const res = axios.get(`/api/urlsign/converstationServices?auth=${this.state.auth}`);
      this.setState({ messages: res.data });
      this.setState({ converstationChats: res.data });

      this.setState = { loading: false };
    };

    fetchPosts();
  };
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
  render() {
    const { t } = this.props;
    const Exit = withRouter(({ history }) => (
      <Button
        onClick={() => {
          history.push('/');
        }}
      >
        {t('chatResponse.exit')} <ExitToAppIcon> {t('chatResponse.exit')}</ExitToAppIcon>
      </Button>
    ));
    return (
      <div>
        {(() => {
          if (this.state.converstationChat === null || this.state.converstationChat === '') {
            return <div className="canNotReply">{t('chatResponse.canNotReply')}</div>;
          } else {
            return (
              <div className="containerPaper">
                <div className="container">
                  <div className="containerReply">
                    <div className="stylesDiv0" style={{ backgroundColor: this.state.defaultColor }}>
                      <div className="converstationStrong1a">{this.state.converstationChat?.subject}</div>
                      <div className="float-right">
                        <Exit />
                      </div>
                    </div>
                    <div className="stylesDiv1" style={{ border: '2px solid', color: this.state.defaultColor }}>
                      <div className="message">
                        <Grid container direction="column" spacing={1}>
                          {this.state.messages.map((message) => (
                            <div className="Message" key={message.id} name={message.id}>
                              <Grid
                                style={{
                                  marginLeft: '-15px',
                                  width: '100%',
                                }}
                              >
                                {(() => {
                                  if (message.isMyMessage === false) {
                                    return (
                                      <div className="float-right">
                                        {(() => {
                                          if (message.picture === null || message.picture === '') {
                                            return;
                                          }
                                          if (message.picture.length !== null) {
                                            return (
                                              <div className="card12">
                                                <img
                                                  style={{
                                                    borderWidth: 1,
                                                    height: 70,
                                                    width: 150,
                                                  }}
                                                  src={`${message.picture}`}
                                                  alt=""
                                                />
                                              </div>
                                            );
                                          }
                                        })()}
                                        <div>
                                          <div className="myMessage">
                                            {message.message?.split('\n').map((str, idx) => (
                                              <p key={message.id + idx}>{str}</p>
                                            ))}
                                          </div>
                                          <div
                                            className="stylesDiv2"
                                            ref={(el) => {
                                              this.messagesEnd = el;
                                            }}
                                          >
                                            {(() => {
                                              if (localStorage.getItem('i18nextLng') === 'fi') {
                                                return <div>{moment(message.timeDate).format('HH:mm DD.MM.YYYY')}</div>;
                                              } else {
                                                return <div>{moment(message.timeDate).format('DD/MM/YY HH:mm')}</div>;
                                              }
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }

                                  if (message.isMyMessage === true) {
                                    return (
                                      <div className="float-left">
                                        {(() => {
                                          if (message.picture === null || message.picture === '') {
                                            return;
                                          }
                                          if (message.picture.length !== null) {
                                            return (
                                              <div className="card12">
                                                <img
                                                  style={{
                                                    borderWidth: 1,
                                                    height: 70,
                                                    width: 150,
                                                  }}
                                                  src={`${message.picture}`}
                                                  alt=""
                                                />
                                              </div>
                                            );
                                          }
                                        })()}{' '}
                                        <div className="notMyMessage2">
                                          {message.message.split('\n').map((str, idx) => (
                                            <p key={message.id + idx}>{str}</p>
                                          ))}
                                        </div>
                                        <div
                                          className="stylesDiv3"
                                          ref={(el) => {
                                            this.messagesEnd = el;
                                          }}
                                        >
                                          {(() => {
                                            if (localStorage.getItem('i18nextLng') === 'fi') {
                                              return <div>{moment(message.timeDate).format('HH:mm DD.MM.YYYY')}</div>;
                                            } else {
                                              return <div>{moment(message.timeDate).format('DD/MM/YY HH:mm')}</div>;
                                            }
                                          })()}{' '}
                                        </div>
                                      </div>
                                    );
                                  }
                                })()}
                              </Grid>
                            </div>
                          ))}
                        </Grid>
                      </div>
                    </div>

                    <div>
                      <form onSubmit={this.handleSubmit} id="chatformText" className="stylesDiv4">
                        <div className="" style={{ backgroundColor: this.state.defaultColor, border: '2px solid', color: this.state.defaultColor }}>
                          <TextareaAutosize type="textarea" required name="message" maxLength={250} placeholder={t('chatReplyForm.text')} onChange={this.handleChange} className="textAreacStyle" />
                          <Button type="submit" style={{ width: '100%' }}>
                            {t('chatReplyForm.send')} <SendIcon>{t('chatReplyForm.send')}</SendIcon>
                          </Button>
                          <div className="picture">
                            <Input
                              type="file"
                              id="image"
                              style={{ display: 'none', color: '#000000', fontSize: '20px', border: 'none' }}
                              inputprops={{ display: 'none', accept: 'image/*, .xlsx, .xls, .csv, .pdf, .pptx, .pptm, .ppt' }}
                              name="originalFileName"
                              onChange={this.fileChangedHandler}
                            />
                            <label htmlFor="image">
                              <Tooltip title={<div className="toolpin ">{t('itemInput.attachment')}</div>} placement="top">
                                <Button style={{ color: '#3ac162', border: 'none' }} aria-label="upload picture" component="span">
                                  <AttachmentIcon />
                                  {`${this.state.fileName}`}
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
                                        <div className="float-right" style={{ backgroundColor: this.state.defaultColor, border: '2px solid', color: this.state.defaultColor }}>
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
                                      </div>
                                    );
                                  }
                                })()}
                              </div>
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
export default withTranslation()(ChatResponse);
