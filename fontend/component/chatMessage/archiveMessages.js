import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { authHeader } from '../../authentication/AuthHeader';
import '../../../src/styles/index.scss';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

class archiveMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      converstationChat: null,
      currentConverstationChatId: props.location?.search?.replace('?', '') || 0,
      messages: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.fetchConverstationChatMessages();
    this.fetchConverstation();
  }
  fetchConverstationChatMessages = () => {
    axios.get(`/api/converstationServices/${this.state.currentConverstationChatId}/messages`, { headers: authHeader() }).then((res) => {
      this.setState({ messages: res.data });
    });
  };
  fetchConverstation = () => {
    axios.get(`/api/converstationServices/${this.state.currentConverstationChatId}`, { headers: authHeader() }).then((res) => {
      this.setState({ converstationChat: res.data });
    });
  };

  render() {
    const { t } = this.props;
    const Exit = withRouter(({ history }) => (
      <Button
        onClick={() => {
          history.push('/archive');
        }}
      >
        {t('chatReplyForm.exit')} <ExitToAppIcon> {t('chatReplyForm.exit')}</ExitToAppIcon>
      </Button>
    ));
    return (
      <div className="containerPaper" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="container1">
            <div className="stylesDiv11">
              <div className="converstationStrong5">{this.state.converstationChat?.subject}</div>{' '}
              <div className="float-right">
                <Exit />
              </div>
            </div>
            <div className="stylesDiv12">
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
                          if (message.isMyMessage === true) {
                            return (
                              <div className="float-right" style={{ marginRight: '-35px' }}>
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
                                <div className="myMessageArchieve">
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
                                  <div className="notMyMessage">
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
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(archiveMessages);
