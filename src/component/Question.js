import React from 'react';
import { Header, Button} from 'semantic-ui-react'


class Question extends React.Component {

    render(){
        const { question, options, questionId }  = this.props.question;
        return(
            <>
                <Header as="h4" 
                content = {question} 
                style = {{marginBottom:'4px', marginTop:'4px'}}
                ></Header>
                {
                    options.map((option,idx) =>
                        (
                            <Button key={idx} id={questionId.toString() + '-' + idx.toString()}
                            disabled={this.props.disabled} 
                            className = {this.props.answer === idx? 'blink':'' }
                            onClick = {() => this.props.onClick(option)} 
                            fluid>{option}</Button>
                        )
                    )
                }
            </>
        );
    }
}

export default Question;