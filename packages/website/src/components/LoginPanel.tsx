import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { LoginServerResults } from '../types';
import { makeAPIRequest } from '../utils/APIRequests';
import { NotificationModal } from './NotificationModal';

interface LoginPanelProps {
  onSuccess: (results: LoginServerResults) => void;
}

export interface LoginPanelResults {
  firstName: string;
  lastName: string;
  addressNumber: string;
}

export function LoginPanel(props: LoginPanelProps) {
  const [badLogin, setBadLogin] = useState(false);
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
      makeAPIRequest(results, (successful: boolean, serverResult: LoginServerResults | undefined) => {
        setBadLogin(!serverResult?.success);
        if (successful && serverResult !== undefined) {
          props.onSuccess(serverResult);
        }
      });
    }
  }
  return (
    <Form onSubmit={validateLogin}>
      <Form.Group className="mb-3" controlId='description'>
        <Form.Label>Login to Update RSVP</Form.Label>
      </Form.Group>

      <Form.Group className="mb-3" controlId="firstName">
        <Form.Control required autoComplete='given-name' type="text" name='firstName' placeholder="First Name" onChange={onInputChange} value={results.firstName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="lastName">
        <Form.Control required autoComplete='family-name' type="text" name='lastName' placeholder="Last Name" onChange={onInputChange} value={results.lastName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="addressNumber">
        <Form.Control required type="number" name='addressNumber' placeholder="Address Number" onChange={onInputChange} value={results.addressNumber} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Begin
      </Button>

      <NotificationModal title="Invalid Login" setVisible={setBadLogin} visible={badLogin}>
        <p>
          The login you provided was not valid. Please make sure your first and last
          name, as well as the address number for where you live is valid.
          <br />
          <br />
          If you continue to have issues, please reach out to Gerald or Megan for support.
        </p>
      </NotificationModal>
    </Form>
  );
}
