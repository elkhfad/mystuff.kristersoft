import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MyAppRoute from './myAppRoute';
import axios from 'axios';
import { authHeader } from '../../authentication/AuthHeader';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import authenticationService from '../../authentication/authenticationService';
import ViewListIcon from '@material-ui/icons/ViewList';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import HelpIcon from '@material-ui/icons/Help';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Dropdown from 'react-bootstrap/Dropdown';
import { Gb } from 'react-flags-select';
import { Fi } from 'react-flags-select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Footer from './Footer';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MessageIcon from '@material-ui/icons/Message';
import DraftsIcon from '@material-ui/icons/Drafts';
import LanguageIcon from '@material-ui/icons/Language';
import SourceIcon from '@mui/icons-material/Source';
import i18next from 'i18next';
import swal from 'sweetalert';
const drawerWidth = 250;

const styles = (theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },

  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      defaultColor: '#00264d',
      converstationChats: [],
      count: 0,
      color: '',
    };
    this.fetchUsersdefaultColor = this.fetchUsersdefaultColor.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
    this.fetchConverstationChats = this.fetchConverstationChats.bind(this);
    this.fetchUsersAvatar = this.fetchUsersAvatar.bind(this);
  }
  closeNavbar = () => {
    this.setState({
      open: false,
    });
  };
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };
  fetchUsersdefaultColor = () => {
    axios.get(`/api/users/defaultColor`, { headers: authHeader() }).then((res) => {
      this.setState({ defaultColor: res.data });
      sessionStorage.setItem('defaultColorStore', res.data);
    });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  async componentDidMount() {
    this.fetchUsersdefaultColor();
    this.fetchUsersAvatar();
    if (sessionStorage.getItem('currentUser') !== null) {
      this.fetchConverstationChats();
      this.fetchUsersdefaultColor();
    }
  }
  logInCornForming = () => {
    let { t } = this.props;
    swal({
      title: `${t('logout.title')}`,
      icon: 'warning',
      buttons: {
        cancel: `${t('logout.cancel')}`,
        ok: `${t('logout.ok')}`,
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        authenticationService.logout().then((res) => {
          console.log('LOGGED_OUT');
        });
      } else {
        swal(`${t('logout.loggedOut')}`);
      }
    });
  };
  handleClick(lang) {
    i18next.changeLanguage(lang);
    this.handleDrawerClose();
  }
  fetchConverstationChats = () => {
    var count = 0;
    axios.get(`/api/converstationServices`, { headers: authHeader() }).then((res) => {
      this.setState({ converstationChats: res.data });
      this.state.converstationChats.forEach((converstation) => {
        converstation.messages.forEach((message) => {
          if (message.readTime === false) {
            count = count + 1;
          }
        });
      });
      this.setState({ count: count });
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (sessionStorage.getItem('currentUser') !== null) {
      if (prevState.converstationChats.length !== this.state.converstationChats.length) {
        this.fetchConverstationChats();
      }
    }
  }
  fetchUsersAvatar = () => {
    axios.get(`/api/users/avatar`, { headers: authHeader() }).then((res) => {
      this.setState({ color: res.data });
    });
  };
  useEffect = () => {
    const fetchPosts = async () => {
      const res = axios.get(`/api/users/defaultColor`, { headers: authHeader() });
      this.setState({ defaultColor: res.data });
    };

    fetchPosts();
    sessionStorage.setItem('defaultColorStore', this.state.defaultColor);
  };
  render() {
    const { classes, theme } = this.props;
    const user = authenticationService.currentUserValue?.username;
    const { t } = this.props;
    return (
      <div>
        {(() => {
          return (
            <BrowserRouter basename="./">
              <div className={classes.root}>
                <CssBaseline />

                <AppBar
                  style={{ backgroundColor: sessionStorage.getItem('currentUser') !== null ? sessionStorage.getItem('defaultColorStore') : '#00264d' }}
                  position="fixed"
                  className={classNames(classes.appBar, {
                    [classes.appBarShift]: this.state.open,
                  })}
                >
                  <Toolbar disableGutters={!this.state.open}>
                    <IconButton
                      color="inherit"
                      aria-label="Open drawer"
                      onClick={this.handleDrawerOpen}
                      className={classNames(classes.menuButton, {
                        [classes.hide]: this.state.open,
                      })}
                    >
                      <MenuIcon />
                    </IconButton>

                    <Typography variant="h1" noWrap>
                      Kristersoft
                    </Typography>
                  </Toolbar>
                </AppBar>

                <Drawer
                  variant="permanent"
                  className={classNames(classes.drawer, {
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                  })}
                  classes={{
                    paper: classNames({
                      [classes.drawerOpen]: this.state.open,
                      [classes.drawerClose]: !this.state.open,
                    }),
                  }}
                  open={this.state.open}
                >
                  <div className={classes.toolbar}>
                    <IconButton onClick={this.handleDrawerClose}>{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
                  </div>
                  <Divider />

                  <div className="appBarList">
                    <List>
                      <Link to="/" onClick={this.closeNavbar}>
                        <ListItem button>
                          <ListItemIcon>
                            <HomeIcon />
                          </ListItemIcon>
                          <ListItemText primary={t('navBar.home')} />
                        </ListItem>
                      </Link>
                      <Link to="/message" onClick={this.closeNavbar}>
                        <ListItem button>
                          <ListItemIcon>
                            <MessageIcon />
                          </ListItemIcon>
                          <ListItemText primary={t('navBar.foundMyProperty')} />
                        </ListItem>
                      </Link>

                      <div>
                        {(() => {
                          if (!authenticationService.currentUserValue) {
                            return (
                              <Link to="/login" onClick={this.closeNavbar}>
                                <ListItem button>
                                  <ListItemIcon>
                                    <LockIcon style={{ color: '#FF0000', border: 'none' }} />
                                  </ListItemIcon>
                                  <ListItemText primary={t('navBar.login')} />
                                </ListItem>
                              </Link>
                            );
                          }
                        })()}
                      </div>
                      <Link to="/help" onClick={this.closeNavbar}>
                        <ListItem button>
                          <ListItemIcon>
                            <HelpIcon />
                          </ListItemIcon>
                          <ListItemText primary={t('navBar.help')} />
                        </ListItem>
                      </Link>
                      <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                          <LanguageIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ height: '100%' }}>
                          <Dropdown.Item onClick={() => this.handleClick('en')}>
                            <div className="language">
                              {t('navBar.en')} <Gb />
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => this.handleClick('fi')}>
                            <div className="language">
                              {t('navBar.fi')} <Fi />
                            </div>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                        <p className="languageBar"> {t('navBar.language')}</p>
                      </Dropdown>
                    </List>

                    <List>
                      <div className={`${!authenticationService.currentUserValue && 'hide'}`}>
                        <Divider />
                        <Link to="/user" onClick={this.closeNavbar}>
                          <ListItem button>
                            <ListItemIcon>
                              <Avatar
                                style={{
                                  backgroundColor: this.state.color,
                                  fontSize: '0.8em',
                                  height: '2em',
                                  width: '2em',
                                }}
                              >
                                {user ? user.charAt(0) : 'u'} {user ? user.charAt(user.length - 1) : ''}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={t('navBarDropDownMenu.MyAccount')} />
                          </ListItem>
                        </Link>
                        <Link to="/items-list" onClick={this.closeNavbar}>
                          <ListItem button>
                            <ListItemIcon>
                              <ViewListIcon />
                            </ListItemIcon>
                            <ListItemText primary={t('navBarDropDownMenu.ItemList')} />
                          </ListItem>
                        </Link>
                        <div>
                          {(() => {
                            if (this.state.count === 0) {
                              return (
                                <div className="mailEqualsZero">
                                  <Link to="/chat" onClick={this.closeNavbar}>
                                    <ListItem button>
                                      <ListItemIcon>
                                        <DraftsIcon />
                                      </ListItemIcon>
                                      <ListItemText primary={t('navBarDropDownMenu.chat')} />
                                    </ListItem>
                                  </Link>
                                </div>
                              );
                            }
                            if (this.state.count > 0) {
                              return (
                                <div className="mail">
                                  <Link to="/chat" onClick={this.closeNavbar}>
                                    <ListItem button>
                                      <ListItemIcon>
                                        <Badge
                                          badgeContent={this.state.count}
                                          color="secondary"
                                          anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                          }}
                                        >
                                          <MailIcon />
                                        </Badge>
                                      </ListItemIcon>
                                      <ListItemText primary={t('navBarDropDownMenu.chat')} />
                                    </ListItem>
                                  </Link>
                                </div>
                              );
                            }
                          })()}
                        </div>
                        <Link to="/archive" onClick={this.closeNavbar}>
                          <ListItem button>
                            <ListItemIcon>
                              <SourceIcon />
                            </ListItemIcon>
                            <ListItemText primary={t('navBarDropDownMenu.archive')} />
                          </ListItem>
                        </Link>
                        <div>
                          {(() => {
                            if (authenticationService.currentUserValue) {
                              return (
                                <Link to="/login" onClick={this.closeNavbar}>
                                  <ListItem button onClick={this.logInCornForming}>
                                    <ListItemIcon>
                                      <LockOpenIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={t('navBar.logout')} />
                                  </ListItem>
                                </Link>
                              );
                            } else {
                              return (
                                <Link to="/login" onClick={this.closeNavbar}>
                                  <ListItem button>
                                    <ListItemIcon>
                                      <LockIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={t('navBar.login')} />
                                  </ListItem>
                                </Link>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    </List>
                  </div>
                </Drawer>
              </div>
              <MyAppRoute />
            </BrowserRouter>
          );
        })()}
        <Footer />
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(withTranslation()(App));
