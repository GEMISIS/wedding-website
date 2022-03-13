import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { APIResult, FamilyInfo, LoginRequest } from '../types';
import { makeAPIRequest } from '../utils/APIRequests';
import { NotificationModal } from './NotificationModal';

interface LoginPanelProps {
  onSuccess: (loginInfo: LoginRequest, familyInfo: FamilyInfo) => void;
}

export function LoginPanel(props: LoginPanelProps) {
  const [badLogin, setBadLogin] = useState(false);
  const [request, setRequest] = useState<LoginRequest>(new LoginRequest());

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRequest({
      ...request,
      [event.currentTarget.name]: event.currentTarget.value
    } as LoginRequest);
  }

  const validateLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.checkValidity() !== false) {
      makeAPIRequest(request, (successful: boolean, serverResult: APIResult | undefined) => {
        const loginSuccess = (successful && (serverResult !== undefined) && (serverResult.familyInfo !== undefined));
        setBadLogin(!loginSuccess);
        // HACK: Because the boolean is a type check (e.g. familyInfo is not undefined) at runtime, we
        // need to still do another check for undefined here for the compiler.
        if (loginSuccess && (serverResult.familyInfo !== undefined)) {
          props.onSuccess(request, serverResult.familyInfo);
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
        <Form.Control required autoComplete='given-name' type="text" name='firstName' placeholder="First Name" onChange={onInputChange} value={request.firstName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="lastName">
        <Form.Control required autoComplete='family-name' type="text" name='lastName' placeholder="Last Name" onChange={onInputChange} value={request.lastName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="addressNumber">
        <Form.Control required type="number" name='addressNumber' placeholder="Address Number" onChange={onInputChange} value={request.addressNumber} />
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
