import React from 'react';
import {Progress} from 'semantic-ui-react';

class Timer extends React.Component {

    ProgressBarStatus = {
        SUCCESS:'success',
        WARNING: 'warning',
        ERROR: 'error'
    }

    defaultTime = 20*1000; // seconds
    callbackInterval = 40; // miliseconds
    setTimeoutMethod = null; // variable for setting the setTimer
    
    state = {
        timeLeft: this.props.totalTime || this.defaultTime,
        lastNow: Date.now(),
        percent: this.props.percent,
        status: this.ProgressBarStatus.SUCCESS,
        disabled: this.props.disabled || false,
    }

    getStatus = (percent) => {
        percent = percent || 100;
        if ( percent >= 80 ) {
            return this.ProgressBarStatus.SUCCESS
        }
        if ( percent < 80 && percent > 20 ) {
            return this.ProgressBarStatus.WARNING
        }
        if ( percent <= 20 ) {
            return this.ProgressBarStatus.ERROR
        }
        return this.ProgressBarStatus.ERROR
    }

    freezeTimer = () => {

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
        this.setState((old) => {
            let timeLeft = old.timeLeft - timeElapsedInMilliseconds;
            return {
                timeLeft: timeLeft,
                lastNow: now,
                percent: (timeLeft/totalTime )*100,
                disabled: this.props.disabled || (timeLeft/totalTime)*100 <= 0? true: false,
                timerDisabled: (timeLeft/totalTime)*100 <= 0
            }}
        );
        this.setTimeoutMethod = setTimeout(this.decreaseTime , this.callbackInterval);
    }

    componentDidMount() {
        this.setState({
            status: this.getStatus(this.state.percent)
        });
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
                success = { this.ProgressBarStatus.SUCCESS === this.getStatus(this.state.percent)} 
                error = { this.ProgressBarStatus.ERROR === this.getStatus(this.state.percent)} 
                warning = { this.ProgressBarStatus.WARNING === this.getStatus(this.state.percent)} 
                disabled = {this.state.timerDisabled}
                style = {{marginTop:'4px', marginBottom:'0px'}}
                />
            </>
        )
    }
};

export default Timer;