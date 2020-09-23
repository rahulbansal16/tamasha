import React from 'react';
import {Input, Button, Icon, Visibility} from 'semantic-ui-react';

class ImageUpload extends React.Component {


    constructor(props){
        super(props)
        this.fileInput = React.createRef();
    }

    uploadImage = () => {
        console.log("Post Iamge");
        this.fileInput.current.click();
        console.log("Hi lets see what can be done");
    }
    
    fileChange = (event) => {
        console.log(event.target.files)
        this.props.imageHandler(event.target.files[0]);
    }

    readImage = (file) => {
        if (file.type && file.type.indexOf('image') === -1) {
          console.log('File is not an image.', file.type, file);
          return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
        //   img.src = event.target.result;
        });
        reader.readAsDataURL(file);
      }



    render(){
        return(

            <>
                <input type="file" accept="image/*" 
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
                />
            </>
        );
    }
}

export default ImageUpload;