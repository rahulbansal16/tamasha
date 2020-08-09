import React from 'react';
import { Container, Header, Form, Image, Button,TextArea } from 'semantic-ui-react';
import {functions} from '../../firebase';
// TODO: If the user does not have permission to edit his page
// take him to his default page
const onClick = async (eventId) => {
    try {
        
        // const questions = document.getElementById('textArea').
        const createQuestions = functions.httpsCallable('createQuestions');
        const res = await createQuestions({
          eventId:  eventId,
          questions: [
              {
                order: 0,
                question:'How are you going to achieve this?',
                questionId: 'ljkfajdsflkads',
                options: [
                    'option1',
                    'option2',
                    'option3',
                    'option4'
                ]                
              },
              {
                order: 1,
                question:'Do you think order matters in life?',
                questionId: 'fdsfdsdf',
                options: [
                    'Yes',
                    'No',
                    'Maybe',
                    'Dont want to answer'
                ]                
              }
          ]
      });
        return res
     }
     catch(err) {
         console.log("OOps! errro pushing the questions", err);
     }
}

const EditHostEventPage = (props) => {
    const id = props.match.params.id;
   return (
       <Container>
           <Header content={"Edit Your Event"}></Header>
           <Form>
                <Form.Field>
                    <label>Event Title</label>
                    <input placeholder='Event Title' />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <input placeholder='Description' />
                </Form.Field>
                <Form.Field>
                    <label>Cover Photo</label>
                    <input placeholder='Event Title' />
                </Form.Field>
                <Image src="" size = "medium">
                </Image>
                <TextArea id="textArea" placeholder="Paste Question JSON"/>
                <Button onClick={ () => onClick(id)}>Add Questions</Button>
           </Form>
       </Container>
   );
}
export default EditHostEventPage;