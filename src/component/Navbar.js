import React from 'react';
import { Menu, Icon } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";

const stackedNavbarStyle = {
    width: '360px',
    height: '90vh',
    border: '0px !important',
    position: 'absolute',
    transform: 'translate(-3000px, 0)',
    transition: 'transform 0.3s ease',
    // backgroundColor: 'white',
    zIndex:'10',
    display:'flex',
    flexDirection:'column'
};

const normalMenuStyle = {
    backgroundColor: 'rgb(170, 170, 170)',
    // marginTop:'0px',
    border:'0px !mportant',
    transition: 'transform 0.3s ease',
}

class Navbar extends React.Component{
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    closeMenuBar = (e) => {
        var p = document.getElementById("stackedNavbar")
        p.style.transform = 'translate(-3000px,100px)';   
    }

    navigate = (e, {name}) => {
        console.log("Click the tab", name);
        this.props.history.push('/'+name);
        this.closeMenuBar();
    }

    stackedNavbar = () => {
        return (
            <div style={stackedNavbarStyle} className =  "stackedNavbar"
            id ="stackedNavbar">
                <Menu stackable vertical >

                    <Menu.Item name = "close" onClick = {this.closeMenuBar}>
                            <Icon name="close" /> Close
                    </Menu.Item>

                    <Menu.Item name = "user" onClick = {this.navigate}>
                            <Icon name ="user"/> 
                            User
                    </Menu.Item>

                    <Menu.Item name = "home" onClick = {this.navigate}>
                            Home
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
            <Menu.Item
            name = "bar"
            position = "right"
            onClick = {() => {
                var p = document.getElementById("stackedNavbar")
                // p.style.position = 'relative';
                p.style.transform = 'translate(0,14px)';   
            }}>
            <Icon name="bars"></Icon>
            </Menu.Item>
          </Menu>
        </>
        );
    }

};

export default withRouter(Navbar);