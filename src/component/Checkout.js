import React from 'react';

class Checkout extends React.Component {

    componentDidMount(){
        const script = document.createElement("script");
        script.src = "/path/to/resource.js";
        script.async = true;
        document.body.appendChild(script);
    }
    render(){
        return(

        );
    }
}