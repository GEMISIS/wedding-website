import { FormEvent, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { LoginServerResults, PersonInfo, UpdateFamilyInfoRequest } from "../types";
import { PersonRegistration } from "./PersonRegistration";

interface FamilyRegistrationProps {
  loginServerResults: LoginServerResults;
}

export function FamilyRegistration(props: FamilyRegistrationProps) {
  const [results, setResults] = useState<LoginServerResults>(props.loginServerResults);
  const [badLogin, setBadLogin] = useState(false);

  const onPersonChange = async (personInfo: PersonInfo, index: number) => {
    const tempResults = {
      ...results
    };
    if (tempResults.familyInfo !== undefined) {
      tempResults.familyInfo.people[index] = personInfo;
    }
    setResults(tempResults);
  }

  const validateLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.checkValidity() !== false) {
      const updateRequest = {
        loginInfo: results.loginInfo,
        familyInfo: results.familyInfo
      } as UpdateFamilyInfoRequest;
      console.log(updateRequest);
      fetch(`https://api.geraldandmegan.com/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateRequest)
      }).then(response => response.json()).then(
        (serverResult: LoginServerResults) => {
          console.log(serverResult);
          if (serverResult.success) {
            setBadLogin(false);
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
      {
        props.loginServerResults.familyInfo?.people.map((value, index) => {
          return (
            <div key={index.toString()}>
              <PersonRegistration personInfo={value} onChange={(personInfo) => onPersonChange(personInfo, index)} />
              <br />
            </div>
          );
        })
      }
      <Button variant="primary" type="submit">
        Save Registration
      </Button>

      <Modal show={badLogin} onHide={() => setBadLogin(false)} size='lg' aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Invalid Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            There was an error saving your registration results. Please try submitting your information again. Note that
            if you refresh the page, your current information will be lost.
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
  )
}
