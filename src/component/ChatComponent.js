import React from 'react';
import {Button, Icon, Input} from 'semantic-ui-react';
import { BASE_URL_API } from '../Const';
import {db} from '../firebase';
import ImageUpload from './ImageUpload';
import {fileUploadApiCall} from '../util/fileService'

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
            // I will be collecting the names from the user somehow
            // Lets see what can de
        const result = await db.collection('comments').doc(this.props.id).collection('comments').add({
            author: 'Random name',
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

    // uploadImage = () => {
    //     console.log("Post Iamge");
    //     this.fileInput.current.click();
    //     console.log("Hi lets see what can be done");
    // }
    
    // fileChange = (event) => {
    //     console.log(event.target.files)
    //     this.postImage(event.target.files[0],'', 'Random Name', this.props.id)
    //     // readImage(event.target.files[0], this.postImage).then(
    //     //     () => console.log("Yes!! Uploaded the file")
    //     // ).catch( err => 
    //     //     console.log('Error in uploading the image', err)
    //     // )
    // }

    // readImage = (file) => {
    //     if (file.type && file.type.indexOf('image') === -1) {
    //       console.log('File is not an image.', file.type, file);
    //       return;
    //     }
    //     const reader = new FileReader();
    //     reader.addEventListener('load', (event) => {
    //     //   img.src = event.target.result;
    //     });
    //     reader.readAsDataURL(file);
    //   }


    postImage = (image, comment, author, eventId) => {
        var data = {
            eventId,
            text: comment,
            author,
            uploaded_file: image
        };
       return fileUploadApiCall(data, BASE_URL_API + '/post')
        // const formData = new FormData();
        // formData.append('eventId', eventId)
        // formData.append("text", comment );
        // formData.append("author",  author || 'Random Name'); 
        // formData.append("uploaded_file", image, "noteImage");
  
        // return fetch(BASE_URL_API + '/post',{
        //   method: 'POST',
        //   body: formData
        // }).then( s => console.log(s))
        // .catch(e => console.log(e))
    }



    render(){
        return(
            <div className='chatComponent' style = {style}>
                <ImageUpload imageHandler = {
                    (file) => this.postImage(file,'', 'Random Name', this.props.id )
                }/>
                {/* <input type="file" accept="image/*" 
                ref = {this.fileInput}
                onChange = {this.fileChange}
                // onClick = {}
                style = {{display:'none'}}
                capture="environment"
                ></input>
                <Input 
                ref={this.textInput} style={{height: '90%', width:'72%'}}
                    action={
                        <Button onClick={this.uploadImage}><Icon name = "attach"></Icon></Button>
                      }
                      actionPosition='left'
                /> */}
                <Button disabled={this.props.disabled} style ={{ marginLeft:'auto', width:'28%'}} onClick = { () => this.submitChat() }><Icon name ="send"></Icon>Send</Button>
            </div>
        )
    }
}

export default ChatComponent
