import React from 'react';
import {Progress} from 'semantic-ui-react';

class Timer extends React.Component {

    defaultTime = 20*1000; // seconds
    callbackInterval = 40; // miliseconds
    setTimeoutMethod = null; // variable for setting the setTimer
    
    state = {
        timeLeft: this.props.totalTime || this.defaultTime,
        lastNow: Date.now(),
        percent: this.props.percent,
        success: false,
        error: false,
        warning: false,
        disabled: this.props.disabled || false,
    }

    decreaseTime = () => {
        let totalTime = this.props.totalTime || this.defaultTime;
        if (this.state.timeLeft <= 0 ) {
            clearTimeout(this.setTimeoutMethod);
            this.setTimeoutMethod = null;
            this.props.onComplete();
            return
        }
        let now = Date.now();
        let timeElapsedInMilliseconds = now - this.state.lastNow;
        console.log("The timeElapsed is", timeElapsedInMilliseconds/1000);
        this.setState((old) => (
            {
            timeLeft: old.timeLeft - timeElapsedInMilliseconds,
            lastNow: now,
            percent: ((old.timeLeft- timeElapsedInMilliseconds)/totalTime )*100,
            success: ((old.timeLeft- timeElapsedInMilliseconds)/totalTime )*100 >= 80 ? true: false,
            error: ((old.timeLeft- timeElapsedInMilliseconds)/totalTime )*100 <= 20 ? true: false,
            warning: ((old.timeLeft - timeElapsedInMilliseconds)/totalTime )*100 > 20 && ((old.timeLeft- timeElapsedInMilliseconds)/totalTime )*100 < 80 ? true: false,
            disabled: ((old.timeLeft - timeElapsedInMilliseconds)/totalTime )*100 <= 0? true: false,
            timerDisabled: ((old.timeLeft- timeElapsedInMilliseconds)/totalTime )*100 <= 0
        }));
        this.setTimeoutMethod = setTimeout(this.decreaseTime , this.callbackInterval);
    }

    componentDidMount() {
        this.setTimeoutMethod = setTimeout(this.decreaseTime , this.callbackInterval);
    }

    componentWillUnmount(){
        if(this.setTimeoutMethod !== null){
           clearTimeout(this.setTimeoutMethod) ;
           this.setTimeoutMethod = null;
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