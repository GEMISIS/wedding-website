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
  const [loginRequest, setLoginRequest] = useState<LoginRequest>(new LoginRequest());

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginRequest({
      ...loginRequest,
      [event.currentTarget.name]: event.currentTarget.value
    } as LoginRequest);
  }

  const validateLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.checkValidity() !== false) {
      makeAPIRequest(loginRequest, (successful: boolean, serverResult: APIResult | undefined) => {
        // Need to create a const of the familyInfo to be able to nicely check it.
        const familyInfo = serverResult?.familyInfo;
        const loginSuccess = (successful && (serverResult !== undefined) && serverResult.success && (familyInfo !== undefined));
        setBadLogin(!loginSuccess);
        if (loginSuccess) {
          props.onSuccess(loginRequest, familyInfo);
        }
      });
    }
  }
  return (
    <Form style={{textAlign: 'center'}} onSubmit={validateLogin}>
      <Form.Group className="mb-3" controlId='description'>
        <Form.Label>
          <h2>
            Login to Update RSVP
          </h2>
        </Form.Label>
      </Form.Group>

      <Form.Group className="mb-3" controlId="firstName">
        <Form.Control required autoComplete='given-name' type="text" name='firstName' placeholder="First Name" onChange={onInputChange} value={loginRequest.firstName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="lastName">
        <Form.Control required autoComplete='family-name' type="text" name='lastName' placeholder="Last Name" onChange={onInputChange} value={loginRequest.lastName} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="addressNumber">
        <Form.Control required type="number" name='addressNumber' placeholder="Address Number" onChange={onInputChange} value={loginRequest.addressNumber} />
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
