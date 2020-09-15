import React from 'react'
import { Comment } from 'semantic-ui-react'

  // <Comment.Group>
    {/* <Header as='h3' dividing>
      Comments
    </Header> */}

export const LiveComment = ({author, text}) => (

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
        <Comment.Actions>
          <Comment.Action>Like</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>

  </Comment.Group>
)



// export default Comment;