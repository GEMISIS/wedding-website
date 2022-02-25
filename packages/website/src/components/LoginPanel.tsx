import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

interface LoginPanelProps {
  onSuccess: (results: LoginPanelResults) => void;
}

export interface LoginPanelResults {
  firstName: string;
  lastName: string;
  addressNumber: string;
}

export function LoginPanel(props: LoginPanelProps) {
  const [results, setResults] = useState<LoginPanelResults>({
    firstName: '',
    lastName: '',
    addressNumber: '',
  });

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setResults({
      ...results,
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  const validateLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.checkValidity() !== false) {
      props.onSuccess(results);
    }
  }
  return (
    <Form onSubmit={validateLogin}>
      <Form.Group className="mb-3" controlId='description'>
        <Form.Label>Login to Update RSVP</Form.Label>
      </Form.Group>
      <Form.Group className="mb-3" controlId="firstName">
        <Form.Control required type="text" name='firstName' placeholder="First Name" onChange={onInputChange} value={results.firstName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="lastName">
        <Form.Control required type="text" name='lastName' placeholder="Last Name" onChange={onInputChange} value={results.lastName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="addressNumber">
        <Form.Control required type="number" name='addressNumber' placeholder="Address Number" onChange={onInputChange} value={results.addressNumber} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Begin
      </Button>
    </Form>
  );
}
