import { BehaviorSubject } from 'rxjs';
import { handleResponse } from './responseHandler';
import axios from 'axios';
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL_PROD;
} else if (process.env.NODE_ENV === 'test') {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL_TEST;
} else {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL_DEV;
}
const currentUserSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('currentUser')));

export const authenticationService = {
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

export default authenticationService;

function login(username, password) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  return axios
    .post(`/api/auth/signin`, { username, password }, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  sessionStorage.removeItem('currentUser');
  sessionStorage.clear();
  currentUserSubject.next(null);
  window.location.reload();
}
