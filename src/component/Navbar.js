import React from 'react';
import { Menu, Icon } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";

const stackedNavbarStyle = {
    width: '300px',
    height: '90vh',
    position: 'absolute',
    transform: 'translate(-300px, 0)',
    transition: 'transform 0.3s ease',
    backgroundColor: 'white',
    zIndex:'10',

};

const normalMenuStyle = {
    marginLeft:'10px',
    marginRight:'10px',
    backgroundColor: 'rgb(170, 170, 170)',
    // marginTop:'0px',
    transition: 'transform 0.3s ease',
}

class Navbar extends React.Component{
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    closeMenuBar = (e) => {
        var p = document.getElementById("stackedNavbar")
        p.style.transform = 'translate(-300px,0)';   
    }

    navigate = (e, {name}) => {
        console.log("Click the tab", name);
        this.props.history.push('/'+name);
        this.closeMenuBar();
    }

    stackedNavbar = () => {
        return (
            <div style={stackedNavbarStyle} id ="stackedNavbar">
                <Menu stackable size="massive">

                    <Menu.Item onClick = {()=> this.closeMenuBar()}>
                            <Icon name="close" />
                    </Menu.Item>

                    <Menu.Item name = "user" onClick = {this.navigate}>
                            <Icon name ="user"/> User
                    </Menu.Item>

                    <Menu.Item name = "home" onClick = {this.navigate}>
                            Home
                    </Menu.Item>

                    <Menu.Item name = "order" onClick = {this.navigate}>
                            Order
                    </Menu.Item>

                    <Menu.Item name = "track" onClick = {this.navigate}>
                            Track
                    </Menu.Item>

                    <Menu.Item name = "logout" onClick = {this.navigate}>
                            Logout
                    </Menu.Item>

                </Menu>
            </div>
        );
    }
  
    render() {
        const { activeItem } = this.state
        return (
        <>
            {this.stackedNavbar()}
            <Menu  style = {normalMenuStyle} size="huge">
            {/* <Menu.Item
              name='editorials'
              active={activeItem === 'editorials'}
              onClick={this.handleItemClick}
            >
                Pbuw
            </Menu.Item> */}
            <Menu.Item
            name = "bar"
            position = "right"
            onClick = {() => {
                var p = document.getElementById("stackedNavbar")
                // p.style.position = 'relative';
                p.style.transform = 'translate(0,0)';   
            }}>
            <Icon name="bars"></Icon>
            </Menu.Item>
          </Menu>
        </>
        );
    }

};

export default withRouter(Navbar);