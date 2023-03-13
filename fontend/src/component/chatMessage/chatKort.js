import axios from 'axios';
/*import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
*/
//import Paper from "@material-ui/core/Paper";
import { Button } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { authHeader } from '../../authentication/AuthHeader';
import swal from 'sweetalert';
import { withTranslation } from 'react-i18next';
import { Alert, AlertTitle } from '@material-ui/lab';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Tooltip from '@material-ui/core/Tooltip';
import { Card } from 'react-bootstrap';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import '../../../src/styles/index.scss';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

class chatKort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      converstationChats: [],
      isActive: false,
      currentPage: props.location?.search?.replace('?', '') || 1,
      postsPerPage: 6,
      loading: false,
    };

    this.fetchConverstationChats = this.fetchConverstationChats.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.converstationChats.length !== this.state.converstationChats.length) {
      this.fetchConverstationChats();
    }
    if (prevState.currentPage !== this.state.currentPage) {
    }
  }

  componentDidMount() {
    this.fetchConverstationChats();
  }
  fetchConverstationChats = () => {
    this.setState({ loading: true });
    axios.get(`/api/converstationServices`, { headers: authHeader() }).then((res) => {
      this.setState({ converstationChats: res.data });
      this.setState({ loading: false });
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

  delete = (id) => {
    let { t } = this.props;

    swal({
      title: `${t('chatKort.swal.title')}`,
      text: `${t('chatKort.swal.text')}`,
      icon: 'warning',
      buttons: {
        cancel: `${t('chatKort.swal.cancel')}`,
        ok: `${t('chatKort.swal.ok')}`,
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`${t('chatKort.swal.success')}`, { icon: 'success' });
        axios.delete(`/api/converstationServices/${id}`, { headers: authHeader() }).then((res) => {
          this.setState({ converstationChats: res.data });
        });
      } else {
        swal(`${t('chatKort.swal.dontdelete')}`);
      }
    });
  };
  reply = (id) => {
    axios.post(`/api/converstationServices/${id}`, { headers: authHeader() }).then((res) => {
      this.setState({ converstationChats: res.data });
    });
  };

  useEffect = () => {
    const fetchPosts = async () => {
      this.setState = { loading: true };
      const res = axios.get(`/api/converstationServices`, { headers: authHeader() });
      this.setState({ converstationChats: res.data });
      this.setState = { loading: false };
    };

    fetchPosts();
  };

  render() {
    const { t } = this.props;
    const Reply = withRouter(({ history, converstationChatId }) => (
      <Tooltip title={<div className="toolpin "> {t('chatKort.reply')}</div>} placement="top">
        <Button
          style={{ marginTop: '-50px' }}
          onClick={() => {
            history.push(`/chat-Reply?${converstationChatId}`);
          }}
        >
          <MailIcon fontSize="large" className="greenButton" />
        </Button>
      </Tooltip>
    ));
    const Resolved = withRouter(({ converstationChatId }) => (
      <Tooltip title={<div className="toolpin "> {t('chatKort.resolve')}</div>} placement="top">
        <Button
          style={{ marginTop: '-35px' }}
          onClick={() => {
            this.delete(converstationChatId);
          }}
        >
          <DoneOutlineIcon style={{ color: '#ab0000' }} />
        </Button>
      </Tooltip>
    ));
    return (
      <div className="containerPaper">
        <div className="container">
          <div className="list-group">
            <div>
              {this.state.loading ? <CircularProgress /> : null}

              {(() => {
                if (this.state.converstationChats.length === 0) {
                  return (
                    <div>
                      <div className="converstationStrong4a"> {t('chatKort.text1')}</div>
                    </div>
                  );
                }
                if (this.state.converstationChats.length > 0) {
                  return (
                    <div>
                      <div>
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
                                severity="warning"
                                color="error"
                                style={{
                                  color: '#00264d',
                                  fontSize: '16px',
                                  textAlign: 'left',
                                  top: '13vh',
                                }}
                              >
                                <AlertTitle
                                  style={{
                                    color: '#00264d',
                                    fontSize: '16px',
                                    textAlign: 'left',
                                    top: '13vh',
                                  }}
                                >
                                  <div className="converstationStrong3">{t('chatKort.resolveConverstation')}</div>
                                </AlertTitle>
                              </Alert>
                            </div>
                          )}
                        </div>
                        <div className="converstationStrong4"> {t('chatKort.text2')}</div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>

            {this.state.converstationChats.map((converstationChat) => (
              <Grid key={converstationChat.id}>
                <Card
                  key={converstationChat.id}
                  style={{
                    height: '100px',
                    width: '450px',
                    border: '2px solid',
                    color: sessionStorage.getItem('defaultColorStore'),
                    borderRadius: '20px 20px 20px 20px',
                  }}
                >
                  <Card.Header
                    key={converstationChat.id}
                    style={{
                      height: '100px',
                      width: '450px',
                      border: '2px solid',
                      color: sessionStorage.getItem('defaultColorStore'),
                      borderRadius: '20px 20px 20px 20px',
                      fontSize: '12px',
                    }}
                  >
                    <div className="float-left">
                      <p className="subjectStyle"> {t('chatKort.subject')}</p>
                      <div className="subjectStyleData" style={{ fontSize: '12px' }}>
                        {(() => {
                          if (converstationChat.subject?.length >= 15) {
                            let shortSubject = converstationChat.subject?.substring(0, 14);
                            return <div className="subjectStyleData">{shortSubject + ' ...'}</div>;
                          } else {
                            return <div className="subjectStyleData">{'\u00a0\u00a0' + converstationChat.subject}</div>;
                          }
                        })()}
                      </div>
                    </div>

                    <div className="float-right" style={{ fontSize: '10px' }}>
                      <p className="dateStyle">{t('chatKort.date')}</p>
                      <p className="dateStyleData"> {converstationChat.timeDateCreateConverstationChat}</p>
                    </div>
                    <div>
                      <p className="messageStyle"> {t('chatKort.message')}</p>

                      <div className="centerMessage">
                        {(() => {
                          if (converstationChat.lastMessage?.length >= 15) {
                            let shortLastMessage = converstationChat.lastMessage?.substring(0, 14);
                            return <div className="editLastMessage">{'\u00a0\u00a0' + shortLastMessage + ' ...'}</div>;
                          } else {
                            return <div className="editLastMessage">{'\u00a0\u00a0' + converstationChat.lastMessage}</div>;
                          }
                        })()}
                      </div>
                    </div>

                    <div className="resolvedMessages">
                      <Resolved converstationChatId={converstationChat.id} />
                    </div>
                    <div className="replyBottom">
                      {(() => {
                        if (converstationChat.count > 0) {
                          return (
                            <Badge
                              badgeContent={converstationChat.count}
                              color="secondary"
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                            >
                              <Reply converstationChatId={converstationChat.id} />
                            </Badge>
                          );
                        }
                        if (converstationChat.count <= 0) {
                          return <Reply converstationChatId={converstationChat.id} />;
                        }
                      })()}
                    </div>
                  </Card.Header>
                </Card>
              </Grid>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(chatKort);
