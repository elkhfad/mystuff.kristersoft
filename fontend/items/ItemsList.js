import React from 'react';
import axios from 'axios';
import { authHeader } from '../authentication/AuthHeader';
import ItemsInput1 from './ItemsInput1';
import { Alert, AlertTitle } from '@material-ui/lab';
import authenticationService from '../authentication/authenticationService';
import { withTranslation } from 'react-i18next';
import ListItems from './listItems';
import CardList from './cardList';
import PdfToPrints from './PdfToPrinst';

class ItemsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isActive: false,
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
  handleHide = () => {
    this.setState({
      isActive: false,
    });
  };
  handleShow = () => {
    this.setState({
      isActive: true,
    });
  };
  getHour = () => {
    const date = new Date();
    const hours = date.getHours();
    this.setState({
      hours,
    });
  };
  fetchUsersTable = () => {
    axios.get(`/api/users/isTable`, { headers: authHeader() }).then((res) => {
      this.setState({ isTable: res.data });
    });
  };
  componentDidMount() {
    this.fetchItems();
    this.fetchUsersTable();
    this.getHour();
  }

  fetchItems = () => {
    this.setState({ loading: true }, () => {
      axios.get(`/api/items`, { headers: authHeader() }).then((res) => {
        this.setState({ items: res.data, loading: false, currentItem: res.data.length });
      });
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
    const { hours } = this.state;
    const { t } = this.props;

    return (
      <div className="container">
        <Alert
          severity="info"
          color="success"
          style={{
            color: '#000000',
            fontSize: '16px',
            textAlign: 'center',
            top: '13vh',
          }}
        >
          <AlertTitle
            style={{
              color: '#000000',
              fontSize: '16px',
              textAlign: 'center',
              top: '13vh',
            }}
          >
            <div className="converstationStrong1">
              {hours < 12 ? ` ${t('itemList.morning')}${authenticationService.currentUserValue?.username}` : ` ${t('itemList.evening')} ${authenticationService.currentUserValue?.username}`}
            </div>
          </AlertTitle>
        </Alert>

        {(() => {
          if (this.state.items.length >= this.state.maxi) {
            return (
              <Alert
                severity="warning"
                color="error"
                style={{
                  color: '#000000',
                  fontSize: '16px',
                  textAlign: 'center',
                  top: '13vh',
                }}
              >
                <AlertTitle
                  style={{
                    color: '#000000',
                    fontSize: '16px',
                    textAlign: 'center',
                    top: '13vh',
                  }}
                >
                  <div className="converstationStrong3">
                    {t('itemList.maximus')}
                    {this.state.items?.length}
                  </div>
                </AlertTitle>
              </Alert>
            );
          } else {
            return (
              <Alert
                severity="info"
                color="success"
                style={{
                  color: '#000000',
                  fontSize: '16px',
                  textAlign: 'center',
                  top: '13vh',
                }}
              >
                <AlertTitle
                  style={{
                    color: '#000000',
                    fontSize: '16px',
                    textAlign: 'center',
                    top: '13vh',
                  }}
                >
                  <div className="converstationStrong1">
                    {t('itemList.length')}
                    {this.state.items?.length}
                  </div>
                </AlertTitle>
              </Alert>
            );
          }
        })()}
        <div className="pdfListStyle">
          {(() => {
            if (this.state.items.length > 0) {
              return <PdfToPrints />;
            }
          })()}
          {(() => {
            if (this.state.items.length < this.state.maxi) {
              return <ItemsInput1 refreshItems={this.fetchItems} />;
            }
          })()}
        </div>
        {(() => {
          if (this.state.isTable === true) {
            if (this.state.items.length > 0) {
              return (
                <div>
                  <ListItems />
                </div>
              );
            }
          } else {
            if (this.state.items.length > 0) {
              return (
                <div>
                  <CardList />
                </div>
              );
            }
          }
        })()}
      </div>
    );
  }
}
export default withTranslation()(ItemsList);
