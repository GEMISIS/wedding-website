import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { LoginServerResults } from '../types';

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
      fetch(`https://api.geraldandmegan.com/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      }).then(response => response.json()).then(
        (serverResult: LoginServerResults) => {
          console.log(serverResult);
          if (serverResult.success) {
            setBadLogin(false);
            props.onSuccess(serverResult);
          } else {
            setBadLogin(true);
          }
        },
        (error: Error) => {
          console.log(error.message);
          setBadLogin(true);
        }
      );
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

      <Modal show={badLogin} onHide={() => setBadLogin(false)} size='lg' aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Invalid Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            The login you provided was not valid. Please make sure your first and last
            name, as well as the address number for where you live is valid.
            <br />
            <br />
            If you continue to have issues, please reach out to Gerald or Megan for support.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setBadLogin(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}
