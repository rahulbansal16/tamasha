import React from 'react';
import './App.css';
import UserProvider from './UserProvider';
import Login from './container/Login';
import Navbar from './component/Navbar';
import EventPage from './container/EventPage';
import LiveEventPage from './container/LiveEventPage';
import store from './redux/store'
import { Provider } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './container/Home';
import LogoutPage from './container/LogoutPage';
import UserPage from './container/UserPage';
import HostEventPage from './container/host/HostEventPage';
import HostLiveEventPage from './container/host/HostLiveEventPage';
import {functions} from './firebase';
import EditHostEventPage from './container/host/EditHostEventPage';

class App extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        page:'Home',
        authenticated:false
      }
    }

    navigateToPage = (page)=> {
      this.setState({
        page:page
      })
    }

    application = () => {
        return (
          <Router>
          <div className="App">
            <Navbar/>
            <Switch>
              <Route exact path="/" 
                render = {(props) => <Home {...props} />} />
              <Route path="/home" 
                render = {(props) => <Home {...props} />} />      
              <Route path="/login"
                render = {(props) => <Login {...props} authenticated = {this.state.authenticated} />}/>
{/* TODO: Make the host endpoint only accessible to the creator of the event  */}
              <Route path = "/event/host/:id/edit"
                render = {(props) => <EditHostEventPage {...props}/>} />   
              <Route path = "/event/host/:id/live"
                render = {(props) => <HostLiveEventPage {...props}/>} /> 
              <Route path = "/event/host/:id"
                render = {(props) => <HostEventPage {...props}/>} />    
                             
              <Route path = "/event/:id/live"
                render = {(props) => <LiveEventPage {...props}/>} />   
              <Route path = "/event/:id"
                render = {(props) => <EventPage {...props}/>} />
              <Route path = "/logout"
                render = {(props) =><LogoutPage/>} />
              <Route path = "/user"
                render = {(props) =><UserPage/>} />
            </Switch>
          </div>
        </Router>
      );
    }

    render(){
      return (
        <Provider store = {store}>
          {/* <UserProvider> */}
          {
            this.application()
          }
          {/* </UserProvider> */}
        </Provider>
      );
    }
}

export default App;
