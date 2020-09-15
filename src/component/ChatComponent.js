import React from 'react';
import {Button, Icon, Item, Input} from 'semantic-ui-react';
import {db} from '../firebase';


const style = {
    abc:'',
    position: 'sticky',
    display:'flex',
    alignItems:'center',
    bottom: '0px',
    // backgroundColor:'pink',
    height:'40px'
};

class ChatComponent extends React.Component {

    constructor(props){
        super(props)
        this.textInput = React.createRef();
        this.fileInput = React.createRef();
    }

    submitChat = async () => {
        this.textInput.current.focus();
        const text = this.textInput.current.inputRef.current.value;
        if (  text === null || text === "")
            return;
        const result = await db.collection('comments').doc(this.props.id).collection('comments').add({
            author: 'Random name ',
            text: text,
        })
        // uncomment it to add the api
        // const submitComment = functions.httpsCallable('submitComment');
        // const res = await submitComment({
            // eventId: this.props.id,

        // });
        this.textInput.current.inputRef.current.value = ""
        console.log('The result is', result);
    }

    postImage = () => {
        console.log("Post Iamge");
        this.fileInput.current.click();
        console.log("Hi lets see what can be done");
    }

    render(){
        return(
            <div className='chatComponent' style = {style}>
                <input type="file" accept="image/*" 
                ref = {this.fileInput}
                style = {{display:'none'}}
                capture="environment"
                ></input>
                <Input 
                ref={this.textInput} style={{height: '90%', width:'72%'}}
                    action={
                        <Button onClick={this.postImage}><Icon name = "attach"></Icon></Button>
                      }
                      actionPosition='left'
                />
                <Button disabled={this.props.disabled} style ={{ marginLeft:'auto', width:'28%'}} onClick = { () => this.submitChat() }><Icon name ="send"></Icon>Send</Button>
            </div>
        )
    }
}

export default ChatComponent