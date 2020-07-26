import React from 'react';
import { Container, Header, Form, Image } from 'semantic-ui-react';
// TODO: If the user does not have permission to edit his page
// take him to his default page
const EditHostEventPage = () => {
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
           </Form>
       </Container>
   );
}
export default EditHostEventPage;