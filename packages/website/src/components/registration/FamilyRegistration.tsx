import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Card, CardGroup, Form } from "react-bootstrap";
import { FamilyInfo, LoginRequest, PersonInfo, UpdateFamilyInfoRequest } from "../../types";
import { makeAPIRequest } from "../../utils/APIRequests";
import { NotificationModal } from "../NotificationModal";
import { PersonRegistration } from "./PersonRegistration";

interface FamilyRegistrationProps {
  loginInfo: LoginRequest;
  startingFamilyInfo: FamilyInfo;
}

export function FamilyRegistration(props: FamilyRegistrationProps) {
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>(props.startingFamilyInfo);
  const [badSubmission, setBadSubmission] = useState(false);
  const [goodSubmission, setGoodSubmission] = useState(false);

  const onPersonChange = async (personInfo: PersonInfo, index: number) => {
    const tempResults = {
      ...familyInfo
    };
    if (tempResults !== undefined) {
      tempResults.people[index] = personInfo;
    }
    setFamilyInfo(tempResults);
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFamilyInfo({
      ...familyInfo,
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  const validateLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.checkValidity() !== false) {
      const updateRequest = new UpdateFamilyInfoRequest(props.loginInfo, familyInfo);
      makeAPIRequest(updateRequest, (successful: boolean) => {
        setBadSubmission(!successful);
        setGoodSubmission(successful);
      });
    }
  }
  return (
    <Form className="family-form" onSubmit={validateLogin}>
      <hr />
      <Form.Label>
        <h1>Family Contact Info</h1>
      </Form.Label>
      <hr />
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>
          <h2>Email Address</h2>
        </Form.Label>
        <Form.Control autoComplete='email' type="text" name='email' placeholder="Email" onChange={onInputChange} value={familyInfo?.email} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="phoneNumber">
        <Form.Label>
          <h2>Phone Number</h2>
        </Form.Label>
        <Form.Control autoComplete='phone-number' type="text" name='phoneNumber' placeholder="Phone Number" onChange={onInputChange} value={familyInfo?.phoneNumber} />
      </Form.Group>

      <h2>Family Members</h2>
      <CardGroup className="family-member-card-deck">
        {
          familyInfo?.people.map((value, index) => {
            return (
              <div key={index.toString()}>
                <Card>
                  <Card.Body>
                    <Card.Title>{value.firstName} {value.lastName}</Card.Title>
                    <Card.Text>
                      Attending: {value.attending ? 'Yes' : 'No'}
                      <br/>
                      Entree Selection: {value.entree}
                    </Card.Text>
                    <Button>Update Registration</Button>
                  </Card.Body>
                </Card>
                {/* <PersonRegistration personInfo={value} onChange={(personInfo) => onPersonChange(personInfo, index)} /> */}
                <br />
              </div>
            );
          })
        }
      </CardGroup>
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
