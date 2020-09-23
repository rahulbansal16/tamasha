import React, { Profiler } from 'react';
import './App.css';
import UserProvider from './UserProvider';
import Login from './container/Login';
import Success from './component/Success';
import Navbar from './component/Navbar';
import EventPage from './container/EventPage';
import LiveEventPage from './container/LiveEventPage';
import store from './redux/store'
import { Provider } from 'react-redux'
// https://imgbb.com/ URL For uploading image and getting link to it
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './container/Home';
import CreateProfile from './container/CreateProfile';
import LogoutPage from './container/LogoutPage';
import UserPage from './container/UserPage';
import HostEventPage from './container/host/HostEventPage';
import HostLiveEventPage from './container/host/HostLiveEventPage';
import EditHostEventPage from './container/host/EditHostEventPage';
import { Container } from 'semantic-ui-react';

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
          <Container>
          <Router>
            {/* <Navbar/> */}
            {/* <div className="mainApp"> */}
              <Switch>
                <Route exact path="/" 
                  render = {(props) => <Home {...props} />} />
                <Route path="/home" 
                  render = {(props) => <Home {...props} />} />      
                <Route path = "/profile/:id/live"
                  render = {(props) => <LiveEventPage {...props}/>} /> 
                <Route path = '/profile/:id'
                  render = {(props) => <EventPage {...props}/>} />
                <Route path = "/profile" 
                  render = {(props) => <CreateProfile {...props}/>} />

                <Route path="/login"
                  render = {(props) => <Login {...props} authenticated = {this.state.authenticated} />}/>
                <Route path="/cb" render = { props => <Success {...props}/> }/>

                {/* <Route path = "/profile/host/:id/edit"
                  render = {(props) => <EditHostEventPage {...props}/>} />   
                  <Route path = "/profile/host/:id"
                  render = {(props) => <HostEventPage {...props}/>} />    
                  
                  <Route path = "/profile/:id/live"
                render = {(props) => <LiveEventPage {...props}/>} />    */}
                  
                <Route path = "/logout"
                  render = {(props) =><LogoutPage/>} />
                <Route path = "/user"
                  render = {(props) =><UserPage/>} />
              </Switch>
            {/* </div> */}
          </Router>
        </Container>
      );
    }

    render(){
      return (
        <div className="App">
          <Provider store = {store}>
            <UserProvider/>
            {
              this.application()
            }
          </Provider>
        </div>
      );
    }
}

export default App;
