import React from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { authHeader } from '../authentication/AuthHeader';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
class ItemsPdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isTable: '',
      loading: false,
    };

    this.fetchItemsCB = this.fetchItemsCB.bind(this);
    this.fetchUsersIsTable = this.fetchUsersIsTable.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items.length !== this.state.items.length) {
      this.fetchItems();
      this.fetchUsersIsTable();
    }
    if (prevState.currentPage !== this.state.currentPage) {
    }
  }

  componentDidMount() {
    this.fetchItems();
    this.fetchUsersIsTable();

    const { childRef } = this.props;
    childRef(this);
  }
  fetchUsersIsTable = () => {
    axios.get(`/api/users/isTable`, { headers: authHeader() }).then((res) => {
      this.setState({ isTable: res.data });
    });
  };

  fetchItems = () => {
    this.setState({ loading: true }, () => {
      axios.get(`/api/items`, { headers: authHeader() }).then((res) => {
        this.setState({ items: res.data, loading: false });
      });
    });
  };

  fetchItemsCB() {
    axios.get(`/api/items`, { headers: authHeader() }).then((res) => {
      this.setState({ items: res.data });
    });
  }
  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
  }
  useEffect = () => {
    const fetchPosts = async () => {
      this.setState = { loading: true };
      const res = axios.get(`/api/items`, { headers: authHeader() });
      this.setState({ items: res.data });
      this.setState = { loading: false };
    };

    fetchPosts();
  };

  render() {
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
    return (
      <div className="containerPaper">
        <div className="container">
          <div className="list">
            <div className="exit hideFromPrint">
              <Exit />
            </div>
            <div className="circul">{this.state.loading ? <CircularProgress /> : null}</div>
          </div>
          <div className="container" style={{ margin: '0', padding: '0' }}>
            {(() => {
              if (this.state.isTable === true) {
                if (this.state.items.length > 0) {
                  return (
                    <div>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>{t('itemList.description')}</TableCell>
                              <TableCell>{t('itemList.serial')}</TableCell>
                              <TableCell>{t('itemList.qr')}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.items.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell>{t('itemList.contact')}</TableCell>
                                <TableCell>{t('itemList.putSerial')}</TableCell>
                                <TableCell>{item.itemSerial}</TableCell>
                                <TableCell>
                                  <div className="qRCode">
                                    <QRCode value={'https://mystuff.kristersoft.fi/message'} size={64} bgColor={'#ffffff'} fgColor={'#000000'} level={'Q'} renderas={'canvas'} />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  );
                }
              } else {
                return (
                  <div className="wrapper2" id="pdfdiv" style={{ margin: '0', padding: '0' }}>
                    {this.state.items.map((item, index) => (
                      <div className="listItem" key={item.id}>
                        <div className="card01" key={item.id}>
                          <div className="cardHeader">
                            <div className="cardTileCard1">{t('itemList.name')}</div>
                            <div className="qRCode">
                              <QRCode value={'https://mystuff.kristersoft.fi/message'} size={32} bgColor={'#ffffff'} fgColor={'#000000'} level={'Q'} renderas={'canvas'} />
                            </div>
                            <div>
                              <div className="cardTitle1">{t('itemList.contact')}</div>
                              <div className="cardTitle1">{t('itemList.putSerial')}</div>
                              <div className="cardTitle1">
                                {t('itemList.serial')} {item.itemSerial}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(ItemsPdf);
