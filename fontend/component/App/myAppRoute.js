import React, { Component } from 'react';
import '../../../src/styles/index.scss';
import { withTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Help from '../help/Help';
import Register from '../../login/Register';
import Login from '../../login/Login';
import chatReplyForm from '../chatMessage/chatReplyForm';
import ItemsList from '../../items/ItemsList';
import ItemsPdf from '../../items/ItemsPdf';
import { PrivateRoute } from '../../authentication/PrivateRouter';
import Message from '../chatMessage/Message';
import ForgotPassword from '../../login/ForgotPassword';
import ResetPassword from '../../login/ResetPassword';
import chatKart from '../chatMessage/chatKort';
import ChatResponse from '../chatMessage/ChatResponse';
import AutoLogOut from '../autoLogOut/AutoLogOut';
import archive from '../chatMessage/archive';
import archiveMessages from '../chatMessage/archiveMessages';
import UserDetailUpdatePassword from '../user/UserDetailUpdatePassword';
import UserDetailUpdateEmail from '../user/UserDetailUpdateEmail';
import ConfirmEmail from '../../login/thankYouForConfirmEmail';
import userDetails from '../../component/user/UserDetails';
import privacy from '../privacy';

class MyAppRoute extends Component {
  render() {
    return (
      <div className="content">
        <Switch>
          <Route exact path={'/'} component={Home} />
          <PrivateRoute path="/chat-Reply" component={chatReplyForm} />
          <PrivateRoute path="/archive-messages" component={archiveMessages} />
          <PrivateRoute path="/items-list" component={ItemsList} />
          <PrivateRoute path="/items-pdf" component={ItemsPdf} />
          <PrivateRoute path="/archive" component={archive} />
          <PrivateRoute path="/user-update-password" component={UserDetailUpdatePassword} />
          <PrivateRoute path="/user-update-email" component={UserDetailUpdateEmail} />
          <PrivateRoute path="/chat" component={chatKart} />
          <PrivateRoute path="/user" component={userDetails} />
          <Route path="/Privacy" component={privacy} />
          <Route path="/ResetPassword" component={ResetPassword} />
          <Route path="/help" component={Help} />
          <Route path="/confirmEmail" component={ConfirmEmail} />
          <Route path="/response" component={ChatResponse} />
          <Route path="/registery" component={Register} />
          <Route path="/message" component={Message} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/login" component={Login} />
        </Switch>
        <div>
          {(() => {
            if (sessionStorage.getItem('currentUser') !== null) {
              return <AutoLogOut />;
            } else {
              sessionStorage.removeItem('_expiredTime');
              return;
            }
          })()}
        </div>
      </div>
    );
  }
}
export default withTranslation()(MyAppRoute);
