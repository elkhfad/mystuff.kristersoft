import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { Input } from 'reactstrap';
import AttachmentIcon from '@material-ui/icons/Attachment';
import swal from 'sweetalert';
import ClearIcon from '@material-ui/icons/Clear';
import { Button, TextareaAutosize } from '@material-ui/core';
import { authHeader } from '../../authentication/AuthHeader';
import '../../../src/styles/index.scss';
import React, { Component } from 'react';
import SendIcon from '@material-ui/icons/Send';
import { withTranslation } from 'react-i18next';
import Resizer from 'react-image-file-resizer';
import moment from 'moment';

class chatReplyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      converstationChat: null,
      readTime: true,
      message: '',
      picture: '',
      fileName: '',
      currentConverstationChatId: props.location?.search?.replace('?', '') || 0,
      messages: [],
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchConverstationChatsCB = this.fetchConverstationChatsCB.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
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
    this.fetchConverstationChatsCB();
    this.fetchConverstation();
    this.scrollToBottom();

    setInterval(() => {
      this.fetchConverstationChatsCB();
    }, 30000);
  }
  fetchConverstationChatsCB = () => {
    axios.get(`/api/converstationServices/${this.state.currentConverstationChatId}/messages`, { headers: authHeader() }).then((res) => {
      this.setState({ messages: res.data });
    });
  };
  fetchConverstation = () => {
    axios.get(`/api/converstationServices/${this.state.currentConverstationChatId}`, { headers: authHeader() }).then((res) => {
      this.setState({ converstationChat: res.data });
      this.state.messages.forEach((message) => {
        if (message.readTime === false) {
          this.setState({ readTime: true });
        }
      });

      this.handleReadSubmit();
    });
  };

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

    const url = `/api/converstationServices/${this.state.currentConverstationChatId}`;

    const data = {
      message: this.state.message,
      readTime: this.state.readTime,
      picture: this.state.picture,
      fileName: this.state.fileName,
    };

    axios
      .post(url, data, {
        headers: authHeader(),
      })
      .then((res) => {
        this.fetchConverstationChatsCB();
        this.handleClearForm();
      });
    this.setState({ picture: '' });
    this.setState({ fileName: '' });
    this.setState({ message: '' });
    this.handleClearForm();
    this.fetchConverstationChatsCB();
    this.fetchConverstation();
  };
  handleClearForm = (e) => {
    if (e) {
      e.preventDefault();
    }
    document.getElementById('chatformText').reset();

    this.setState({
      message: '',
      picture: '',
      fileName: '',
    });
  };
  handleReadSubmit = () => {
    const url = `/api/converstationServices/${this.state.currentConverstationChatId}/messages`;

    const data = {
      readTime: this.state.readTime,
    };
    axios
      .put(url, data, {
        headers: authHeader(),
      })
      .then(() => {
        this.fetchConverstationChatsCB();
        this.handleClearForm();
      });
  };

  useEffect = () => {
    const fetchPosts = async () => {
      this.setState = { loading: true };
      const res = axios.get(`/api/converstationServices/${this.state.currentConverstationChatId}/messages`, { headers: authHeader() });
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
        swal(`${t('general.success')}`, { icon: 'success' });

        this.setState({ picture: '' });
        this.setState({ fileName: '' });
      } else {
        swal(`${t('general.text2')}`);
      }
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
        this.handleClearForm();
      }
    }
  }
  render() {
    const { t } = this.props;
    const Exit = withRouter(({ history }) => (
      <Button
        onClick={() => {
          history.push('/chat');
        }}
      >
        {t('chatReplyForm.exit')} <ExitToAppIcon> {t('chatReplyForm.exit')}</ExitToAppIcon>
      </Button>
    ));
    return (
      <div className="containerPaper">
        <div className="container">
          <div className="containerReply">
            <div className="stylesDiv0" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
              <div className="converstationStrong1a" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
                {this.state.converstationChat?.subject}
              </div>
              <div className="float-right">
                <Exit />
              </div>
            </div>

            <div className="stylesDiv1" style={{ border: '0.125em solid', color: sessionStorage.getItem('defaultColorStore') }}>
              <div className="message">
                <Grid container direction="column" spacing={1}>
                  {this.state.messages.map((message) => (
                    <div className="Message" key={message.id} name={message.id}>
                      <Grid
                        style={{
                          marginLeft: '-0.9375em',
                          width: '90%',
                        }}
                      >
                        {(() => {
                          if (message.isMyMessage === true) {
                            return (
                              <div className="float-right" style={{ marginRight: '-25px' }}>
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
                                <div className="myMessage1">
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
                            );
                          }
                          if (message.isMyMessage === false) {
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
                                })()}

                                <div>
                                  <div className="notMyMessage1">
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
                                    })()}
                                  </div>
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
                <div className="" style={{ backgroundColor: sessionStorage.getItem('defaultColorStore'), border: '0.125em solid', color: sessionStorage.getItem('defaultColorStore') }}>
                  <TextareaAutosize
                    type="textarea"
                    required
                    name="message"
                    placeholder={t('chatReplyForm.text')}
                    onChange={this.handleChange}
                    className="textAreacStyle"
                    value={this.state.message}
                    maxLength={250}
                  />
                  <Button type="submit" style={{ width: '100%' }}>
                    {t('chatReplyForm.send')} <SendIcon>{t('chatReplyForm.send')}</SendIcon>
                  </Button>
                  <div className="picture">
                    <Input
                      type="file"
                      id="image"
                      style={{ display: 'none', color: '#000000', fontSize: '1.2500em', border: 'none' }}
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
                                <div
                                  className="float-right"
                                  style={{ backgroundColor: sessionStorage.getItem('defaultColorStore'), border: '0.125em solid', color: sessionStorage.getItem('defaultColorStore') }}
                                >
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
}
export default withTranslation()(chatReplyForm);
