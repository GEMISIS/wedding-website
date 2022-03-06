import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { LoginServerResults, PersonInfo, UpdateFamilyInfoRequest } from "../types";
import { makeAPIRequest } from "../utils/APIRequests";
import { NotificationModal } from "./NotificationModal";
import { PersonRegistration } from "./PersonRegistration";

interface FamilyRegistrationProps {
  loginServerResults: LoginServerResults;
}

export function FamilyRegistration(props: FamilyRegistrationProps) {
  const [results, setResults] = useState<LoginServerResults>(props.loginServerResults);
  const [badSubmission, setBadSubmission] = useState(false);
  const [goodSubmission, setGoodSubmission] = useState(false);

  const onPersonChange = async (personInfo: PersonInfo, index: number) => {
    const tempResults = {
      ...results
    };
    if (tempResults.familyInfo !== undefined) {
      tempResults.familyInfo.people[index] = personInfo;
    }
    setResults(tempResults);
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const tempResults = {
      ...results
    };
    if (tempResults.familyInfo !== undefined) {
      tempResults.familyInfo = {
        ...tempResults.familyInfo,
        [event.currentTarget.name]: event.currentTarget.value
      };
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
      makeAPIRequest(updateRequest, (successful: boolean) => {
        setBadSubmission(!successful);
        setGoodSubmission(successful);
      });
    }
  }
  return (
    <Form onSubmit={validateLogin}>
      <hr />
      <Form.Label>Family Contact Info</Form.Label>
      <hr />
      <Form.Group className="mb-3" controlId="email">
        <Form.Control autoComplete='email' type="text" name='email' placeholder="Email" onChange={onInputChange} value={results.familyInfo?.email} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="phoneNumber">
        <Form.Control autoComplete='phone-number' type="text" name='phoneNumber' placeholder="Phone Number" onChange={onInputChange} value={results.familyInfo?.phoneNumber} />
      </Form.Group>

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
      <Button variant="primary" type="submit" style={{marginBottom: 50}}>
        Save Registration
      </Button>

      <NotificationModal title="Successfully Updated Registration" setVisible={setGoodSubmission} visible={goodSubmission}>
        <p>
          Successfully updated your registration! Check your information and feel free to update it before we close this in June.
          <br />
          If you have any issues or questions, please reach out to Gerald or Megan for support.
        </p>
      </NotificationModal>

      <NotificationModal title="Error Updating Registration" setVisible={setBadSubmission} visible={badSubmission}>
        <p>
          There was an error saving your registration results. Please try submitting your information again. Note that
          if you refresh the page, your current information will be lost.
          <br />
          <br />
          If you continue to have issues, please reach out to Gerald or Megan for support.
        </p>
      </NotificationModal>
    </Form>
  )
}
