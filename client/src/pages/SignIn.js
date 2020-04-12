import React, {
  useContext
} from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import CenterBox from '../layouts/CenterBox';
import {
  SessionContext
} from '../providers/SessionConnection';

function SignInForm() {
  const Session = useContext(SessionContext);
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = async values => {

    await Session.signIn(values.email, values.name);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Form.Group as={Row} controlId="email">
        <Form.Label column sm="2">
          E-Mail
        </Form.Label>
        <Col sm="10">
          <input
            name='email'
            id="email"
            className="form-control"
            aria-describedby="emailHelp"
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          <small id="emailError" show={errors.email && errors.email.message} className="form-text text-danger">
            {errors.email && errors.email.message}
          </small>
          
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
            This is only so we can identify you from the rest
            of the world.
          </small>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="name">
        <Form.Label column sm="2">
          Name
        </Form.Label>
        <Col sm="10">
          <input
            name='name'
            id="name"
            className="form-control"
            aria-describedby="nameHelp"
            ref={register({
              required: 'Required'
            })}
          />
          <small id="nameError" show={errors.name && errors.name.message} className="form-text text-danger">
            {errors.name && errors.name.message}
          </small>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="email">
        <Col md={{ span: 10, offset: 2 }}>
          <Button type="submit" block>Submit</Button>
        </Col>
      </Form.Group>
    </Form>
  );
}

function SignIn() {
  const Session = useContext(SessionContext);
  if (Session.isConnected()) {
    // @TODO: implement logout functionality
    return (<CenterBox className="text-center">
      You are connected. Logout?
    </CenterBox>);
  }
  
  return (<CenterBox>
    <SignInForm />
  </CenterBox>);
}

export default SignIn;
