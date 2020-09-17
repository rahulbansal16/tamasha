import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import {getFirebaseImageURL} from '../util/firebseUtil'


export const LiveComment = ({author, text, imgSrc}) => (

  <Comment.Group>
    <Comment>
      <Comment.Avatar src = 
      {
        "https://avatars.abstractapi.com/v1/?api_key=ac1edc1ea71f409089dfff17ca8e890b&name=" + author
        + '&background_color=' + '&font_color=' + ''
      }
      // 'https://react.semantic-ui.com/images/avatar/small/matt.jpg' 
      />
      <Comment.Content>
        <Comment.Author as='a'>{author}</Comment.Author>  
        <Comment.Metadata>
          <div>Today at 5:42PM</div>
        </Comment.Metadata>
        <Comment.Text>{text}</Comment.Text>
        { imgSrc? 
          <Image size ="huge" src = 
          
          {getFirebaseImageURL(imgSrc)}
          
          // {imgSrc} 
          ></Image>
          :<></>
        }
        <Comment.Actions>
          <Comment.Action>Like</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>

  </Comment.Group>
)



// export default Comment;