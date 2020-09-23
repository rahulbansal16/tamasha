import React from 'react';
import { Container, Header, Form, Image, Button,TextArea, Message } from 'semantic-ui-react';
import ImageUpload from '../component/ImageUpload';
import { BASE_URL_API } from '../Const';
import {functions} from '../firebase'
import {getFirebaseImageURL} from '../util/firebseUtil'
import { fileUploadApiCall } from '../util/fileService';
import {withRouter} from 'react-router-dom';
import { isThisTypeNode } from 'typescript';
const PROFILE_IMAGE_URL_API = BASE_URL_API + '/profile/image'


class CreateProfile extends React.Component {

    constructor(props){
        super(props);
        this.nameRef = React.createRef();
        this.descriptionRef = React.createRef()
        this.feesRef = React.createRef()
        this.state = {
            error: false,
            errorMessage: '',
            loading: false
        }
    }

    convertStringToUrl = (name) => {
        if (!name)
            return ''
        return name.replace(' ','_')
    }

    isFormValid = () => {
        if (!this.nameRef.current.value){
            this.setState({
                error: true,
                errorMessage: 'Coaching Center Name can not be blank'
            })
            return false;
        }
        if (!this.descriptionRef.current.value){
            this.setState({
                error: true,
                errorMessage: 'Subjects you are teaching can not be blank'
            })
            return false;
        }
        if (this.state.error){
            this.setState({
                errorMessage: '',
                error: false
            })
        }
        return true;
    }

    createProfile = async () => {
        const status = this.isFormValid();
        if (!status){
        return
        }
        this.setState({
            loading: true
        })
        if ( this.imageUploadPromise){
            const imageUpload = await this.imageUploadPromise;
            const body = await imageUpload.json()
            this.coverImageUploadedName = body.uploadName;
            this.imageUploadPromise = null;
        }
        const createProfile = functions.httpsCallable('createProfile');
        const imagaeUrl = getFirebaseImageURL(this.coverImageUploadedName);
        this.url = this.convertStringToUrl(this.nameRef.current.value)
        console.log(imagaeUrl)
        let result = await createProfile({
            name: this.url,
            imgSrc: imagaeUrl,
            description: this.descriptionRef.current.value,
            fees: this.feesRef.current.value || 0
        });
        this.setState({
            loading: false
        })
        this.createSharingUrl();
        // Allow People to share the url
    }

    createSharingUrl = () => {
        this.props.history.push({
            pathname: '/profile/'+ this.url
        });
    }

    readImage = (file) => {
        if (file.type && file.type.indexOf('image') === -1) {
          console.log('File is not an image.', file.type, file);
          return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            document.getElementById('cover-image').src = event.target.result;
        });
        reader.readAsDataURL(file);
    }

    populateImage = async (coverImage) => {
        this.coverImage = coverImage;
        let data = {
            coverImage
        }
        this.readImage(coverImage)
        this.imageUploadPromise = fileUploadApiCall(data, PROFILE_IMAGE_URL_API);
        // const body = await imageUpload.json()
        // this.coverImageUploadedName = body.uploadName;
    }

    render(){
        return(
            <Container>
                <Form>
                    <Form.Field required>
                        <label>Coaching Center Name</label>
                        <input id = "name" placeholder = 'Maths with Mukesh' ref = {this.nameRef} />
                    </Form.Field>
                    <Form.Field>
                        <label>Cover Photo</label>
                        <ImageUpload imageHandler = {this.populateImage} />
                    </Form.Field>
                    <Form.Field required>
                        <label>Subjects you are teaching</label>
                        <input id = "description" placeholder = '11th and 12th Maths' ref = {this.descriptionRef} />
                    </Form.Field>
                    <Form.Field>
                        <label>Monthly Fees</label>
                        <input id = "fees" placeholder = '100 Rs'  ref = {this.feesRef}/>
                    </Form.Field>
                    <Message  success = {!this.state.error} color="red">
                        {/* <Message.Header></Message.Header> */}
                        <Message.Content>{this.state.errorMessage}</Message.Content>
                    </Message>
                    {/* <TextArea id="textArea" placeholder="Paste Question JSON"/> */}
                    <Button loading = {this.state.loading} primary onClick={ () => this.createProfile()}>Create Profile</Button>
                    <Image style ={{marginTop:'10px'}}src="" id = "cover-image" size = "small">
                    </Image>
                </Form>  
            </Container>
        );
    }
}

export default withRouter(CreateProfile);