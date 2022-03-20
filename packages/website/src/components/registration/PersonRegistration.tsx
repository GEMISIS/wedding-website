import { ChangeEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { AttendingStatus, EntreeTypes, PersonInfo, VaxStatuses } from "../../types";

interface PersonRegistrationProps {
  personInfo: PersonInfo;
  onChange: (personInfo: PersonInfo) => void;
}

export function PersonRegistration(props: PersonRegistrationProps) {
  const [personInfoUpdateResults, setPersonInfoUpdateResults] = useState<PersonInfo>(props.personInfo);

  const onInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPersonInfoUpdateResults({
      ...personInfoUpdateResults,
      [event.currentTarget.name]: (event.currentTarget.type === 'checkbox') ? (event.currentTarget as HTMLInputElement).checked : event.currentTarget.value
    });
  };

  useEffect(() => {
    props.onChange(personInfoUpdateResults);
  }, [personInfoUpdateResults]);

  const uniqueName = personInfoUpdateResults.firstName + '-' + personInfoUpdateResults.lastName;
  return (
    <Form.Group key={'form-' + uniqueName}>
      <Form.Group className="mb-3" key={'attending-' + uniqueName} controlId={'attending-' + uniqueName}>
        <Form.Label>Attending?
          <Form.Select name='attending' onChange={onInputChange} value={personInfoUpdateResults.attending}>
            {Object.keys(AttendingStatus).map((key, value) => {
              return <option key={'AttendingStatus-' + uniqueName + '-' + key} value={key}>{Object.values(AttendingStatus)[value]}</option>
            })}
          </Form.Select>
        </Form.Label>
        <br />

        {/* Only show below here when the person is attending. */}
        <Form.Label>Child?
          <Form.Check type='checkbox' name='isChild' onChange={onInputChange} defaultChecked={personInfoUpdateResults.isChild ?? false} />
        </Form.Label>
        <br />
        <Form.Label>Entree Selection</Form.Label>
        <Form.Select name='entree' onChange={onInputChange} value={personInfoUpdateResults.entree}>
          {Object.keys(EntreeTypes).map((key) => {
            return <option key={'EntreeTypes-' + uniqueName + '-' + key} value={key}>{key}</option>
          })}
        </Form.Select>
        <Form.Label>Vaccination Status</Form.Label>
        <Form.Select name='vaxStatus' onChange={onInputChange} value={personInfoUpdateResults.vaxStatus}>
          {Object.keys(VaxStatuses).map((key, value) => {
            return <option key={'VaxStatuses-' + uniqueName + '-' + key} value={key}>{Object.values(VaxStatuses)[value]}</option>
          })}
        </Form.Select>
      </Form.Group>
    </Form.Group>
  );
}
