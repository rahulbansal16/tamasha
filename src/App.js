import React from 'react';
import './App.css';
import UserProvider from './UserProvider';
import Login from './container/Login';
import Navbar from './component/Navbar';
import EventPage from './container/EventPage';
import LiveEventPage from './container/LiveEventPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './container/Home';
import LogoutPage from './container/LogoutPage';

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
              <Route path = "/event/:id/live"
                render = {(props) => <LiveEventPage {...props}/>} />   
              <Route path = "/event/:id"
                render = {(props) => <EventPage {...props}/>} />
              <Route path = "/logout"
                render = {(props) =><LogoutPage/>} />
            </Switch>
          </div>
        </Router>
      );
    }

    render(){
      return (
        <UserProvider>
        {
          this.application()
        }
        </UserProvider>
      );
    }
}

export default App;
