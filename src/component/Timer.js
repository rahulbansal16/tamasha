import React from 'react';
import {Progress} from 'semantic-ui-react';

class Timer extends React.Component {

    defaultTime = 20*1000; // miliseconds
    callbackInterval = 1000/40; // miliseconds
    setIntervalMethod = null; // variable for setting the setTimer
    
    state = {
        timeLeft: this.props.totalTime || this.defaultTime,
        percent: this.props.percent,
        success: false,
        error: false,
        warning: false,
        disabled: this.props.disabled || false,
    }

    decreaseTime = () => {
        let totalTime = this.props.totalTime || this.defaultTime;
        this.setState((old) => ({
            timeLeft: old.timeLeft - this.callbackInterval,
            percent: ((old.timeLeft- this.callbackInterval)/totalTime )*100,
            success: ((old.timeLeft- this.callbackInterval)/totalTime )*100 >= 80 ? true: false,
            error: ((old.timeLeft- this.callbackInterval)/totalTime )*100 <= 20 ? true: false,
            warning: ((old.timeLeft - this.callbackInterval)/totalTime )*100 > 20 && ((old.timeLeft- this.callbackInterval)/totalTime )*100 < 80 ? true: false,
            disabled: ((old.timeLeft - this.callbackInterval)/totalTime )*100 <= 0? true: false,
            timerDisabled: ((old.timeLeft- this.callbackInterval)/totalTime )*100 <= 0
        }));
    }

    componentDidMount() {
        this.setIntervalMethod = setInterval(this.decreaseTime , this.callbackInterval);
        if (this.state.percent <= 0 ) {
            clearInterval(this.setIntervalMethod);
            this.setIntervalMethod = null;
        }
    }

    componentWillUnmount(){
        if(this.setIntervalMethod !== null){
           clearInterval(this.setIntervalMethod) ;
           this.setIntervalMethod = null;
        }
    }

    render(){
        return(
            <>
                <Progress percent = {this.state.percent} 
                success={this.state.success} 
                error = {this.state.error} 
                warning={this.state.warning} 
                disabled={this.state.timerDisabled}
                style = {{marginTop:'4px', marginBottom:'0px'}}
                />
            </>
        )
    }
};

export default Timer;