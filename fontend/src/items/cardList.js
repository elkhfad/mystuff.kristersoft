import React from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { authHeader } from '../authentication/AuthHeader';
import swal from 'sweetalert';
import Tooltip from '@material-ui/core/Tooltip';
import Pagination from './Pagination';
import { withTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import FileCopyIcon from '@material-ui/icons/FileCopy';
class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentPage: props.location?.search?.replace('?', '') || 1,
      postsPerPage: 6,
      loading: false,
      hours: null,
      isTable: false,
      times: 0,
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
    const indexOfLastPost = (this.state.currentPage || 1) * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = this.state.items.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber) => (this.setState = { pageNumber: this.state.currentPosts });
    const Posts = ({ items }) => {
      return (
        <div className="list-group">
          <div className="wrapper22">
            {items.map((item, index) => (
              <div className="listItem1" key={item.id}>
                <div className="card1" key={item.id} style={{ border: '2px solid', color: sessionStorage.getItem('defaultColorStore') }}>
                  <div className="cardHeader1" style={{ border: '2px solid', color: sessionStorage.getItem('defaultColorStore') }}>
                    <div className="cardTileCard">
                      {item.name} {++index + (this.state.currentPage - 1) * this.state.postsPerPage}
                      <div>
                        <div className="delete">
                          <Tooltip title={<div className="toolpin "> {t('itemList.delete')}</div>} placement="top">
                            <Button
                              onClick={() => {
                                this.delete(item.id);
                              }}
                            >
                              <DeleteIcon style={{ color: '#FF0000', border: 'none' }} />
                            </Button>
                          </Tooltip>
                        </div>
                        <div>
                          {(() => {
                            if (this.state.items.length < this.state.maxi) {
                              return (
                                <div className="copy">
                                  <Tooltip title={<div className="toolpin "> {t('itemList.copy.copyText')}</div>} placement="top">
                                    <Button
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
                      </div>
                    </div>
                    <div>
                      {(() => {
                        if (item.description === null || item.description === '') {
                          return (
                            <div className="cardTitle1">
                              {t('itemList.serial')} {item.itemSerial}
                            </div>
                          );
                        } else {
                          return (
                            <div>
                              <div className="cardTitle1">{t('itemList.description')}</div>
                              <div className="cardTitle2">{item.description}</div>
                              <div className="cardTitle1">
                                {t('itemList.serial')} {item.itemSerial}
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
    return (
      <div>
        <Posts items={currentPosts} />
        <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.items.length} paginate={paginate} />
      </div>
    );
  }
}
export default withTranslation()(CardList);
