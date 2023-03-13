import React from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { authHeader } from '../authentication/AuthHeader';
import swal from 'sweetalert';
import Tooltip from '@material-ui/core/Tooltip';
import { withTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Table from '@material-ui/core/Table';
import { red } from '@material-ui/core/colors';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
class ListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isActive: false,
      loading: false,
      isTable: false,
      maxi: 4,
      currentItem: 0,
    };

    this.fetchItems = this.fetchItems.bind(this);
    this.fetchUsersTable = this.fetchUsersTable.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items.length !== this.state.items.length) {
      this.fetchItems();
    }
    if (prevState.currentPage !== this.state.currentPage) {
    }
  }

  fetchUsersTable = () => {
    axios.get(`/api/users/isTable`, { headers: authHeader() }).then((res) => {
      this.setState({ isTable: res.data });
    });
  };
  componentDidMount() {
    this.fetchItems();
    this.fetchUsersTable();
  }

  fetchItems = () => {
    this.setState({ loading: true }, () => {
      axios.get(`/api/items`, { headers: authHeader() }).then((res) => {
        this.setState({ items: res.data, loading: false, currentItem: res.data.length });
      });
    });
  };
  delete = (id) => {
    let { t } = this.props;

    swal({
      title: `${t('itemList.swal.areYouSure')}`,
      text: `${t('itemList.swal.text')}`,
      icon: 'warning',
      buttons: {
        cancel: `${t('itemList.swal.no')}`,
        ok: `${t('itemList.swal.yes')}`,
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          text: `${t('itemList.swal.success')}`,
          icon: 'success',
          button: `${t('itemList.swal.ok')}`,
        });

        axios.delete(`/api/items/${id}`, { headers: authHeader() }).then((res) => {
          swal({
            text: `${t('itemList.swal.success')}`,
            icon: 'success',
            button: `${t('itemList.swal.ok')}`,
          }).then(function () {
            window.location.reload();
          });
        });
      } else {
        swal(`${t('itemList.swal.text2')}`, { button: `${t('itemList.swal.ok')}` });
      }
    });
  };
  copy = (id) => {
    let { t } = this.props;
    swal({
      title: `${t('itemList.copy.item')}`,
      icon: 'info',
      buttons: {
        cancel: `${t('itemList.copy.cancelButton')}`,
        ok: `${t('itemList.copy.ok')}`,
      },
      dangerMode: true,
    }).then((willCopy) => {
      if (willCopy) {
        const inputValue = 1;
        const inputStep = 1;
        Swal.fire({
          title: `${t('itemList.copy.text')}` + (this.state.maxi - this.state.currentItem),
          html: `
            <input
              type="number"
              value="${inputValue}"
              step="${inputStep}"
              max="${this.state.maxi - this.state.currentItem}"
              min=1
              class="swal2-input"
              id="range-value">`,
          input: 'range',
          inputStep: {
            defaultValue: 1,
          },
          confirmButtonColor: '#3ac162',
          inputAttributes: {
            min: 1,
            max: `${this.state.maxi - this.state.currentItem}`,
            step: inputStep,
          },
          inputValue: 1,
          didOpen: () => {
            const inputRange = Swal.getInput();
            const inputNumber = Swal.getHtmlContainer().querySelector('#range-value');

            // remove default output
            inputRange.nextElementSibling.style.display = 'none';
            inputRange.style.width = '100%';

            // sync input[type=number] with input[type=range]
            inputRange.addEventListener('input', () => {
              inputNumber.value = inputRange.value;
            });

            // sync input[type=range] with input[type=number]
            inputNumber.addEventListener('change', () => {
              inputRange.value = inputNumber.value;
            });
          },
        }).then((res) => {
          axios.post(`/api/items/${id}/${res.value}`, {}, { headers: authHeader() }).then((res) => {
            swal({
              text: `${t('itemList.copy.copied')}`,
              icon: 'success',
              button: `${t('itemList.swal.ok')}`,
            }).then(function () {
              window.location.reload();
            });
          });
        });
      } else {
        swal(`${t('itemList.copy.cancel')}`, { button: `${t('itemList.swal.ok')}` });
      }
    });
  };
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
    return (
      <div className="table">
        {(() => {
          if (this.state.isTable === true) {
            if (this.state.items.length > 0) {
              return (
                <div className="list-group">
                  <div className="wrapper21">
                    <TableContainer>
                      <Table>
                        <TableHead style={{ backgroundColor: sessionStorage.getItem('defaultColorStore') }}>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>{t('itemList.nameItem')}</TableCell>
                            <TableCell>{t('itemList.description')}</TableCell>
                            <TableCell>{t('itemList.serial')}</TableCell>
                            <TableCell>{t('itemList.copy.copy')}</TableCell>
                            <TableCell>{t('itemList.copy.delete')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.items.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>{++index}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.itemSerial}</TableCell>
                              <TableCell>
                                <div>
                                  {(() => {
                                    if (this.state.items.length < this.state.maxi) {
                                      return (
                                        <div>
                                          <Tooltip title={<div className="toolpin "> {t('itemList.copy.copyText')}</div>} placement="top">
                                            <Button
                                              style={{ marginLeft: '-20px' }}
                                              onClick={() => {
                                                this.copy(item.id);
                                              }}
                                            >
                                              <FileCopyIcon />
                                            </Button>
                                          </Tooltip>
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <Tooltip title={<h3>{t('itemList.delete')}</h3>} placement="top">
                                    <Button
                                      style={{ marginLeft: '-20px' }}
                                      onClick={() => {
                                        this.delete(item.id);
                                      }}
                                      outline="true"
                                      color="secondary"
                                      size="large"
                                    >
                                      <DeleteIcon fontSize="large" style={{ color: red[700] }} />
                                    </Button>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              );
            }
          }
        })()}
      </div>
    );
  }
}
export default withTranslation()(ListItems);
