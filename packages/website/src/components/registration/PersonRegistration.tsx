import { ChangeEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { EntreeTypes, PersonInfo, VaxStatuses } from "../../types";

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
      <Form.Group className="mb-3" key={'description-' + uniqueName} controlId={'description' + uniqueName}>
        <hr />
        <Form.Label>{personInfoUpdateResults.firstName} {personInfoUpdateResults.lastName}{personInfoUpdateResults.lastName.endsWith('s') ? '\'' : '\'s'} Registration Info</Form.Label>
        <hr />
      </Form.Group>

      <Form.Group className="mb-3" key={'attending-' + uniqueName} controlId={'attending-' + uniqueName}>
        <Form.Label>Attending?
          <Form.Check type="checkbox" name='attending' onChange={onInputChange} defaultChecked={personInfoUpdateResults.attending} />
        </Form.Label>
        <br hidden={!personInfoUpdateResults.attending} />

        {/* Only show below here when the person is attending. */}
        <Form.Label hidden={!personInfoUpdateResults.attending}>Child?
          <Form.Check hidden={!personInfoUpdateResults.attending} type='checkbox' name='isChild' onChange={onInputChange} defaultChecked={personInfoUpdateResults.isChild ?? false} />
        </Form.Label>
        <br hidden={!personInfoUpdateResults.attending} />
        <Form.Label hidden={!personInfoUpdateResults.attending}>Entree Selection</Form.Label>
        <Form.Select hidden={!personInfoUpdateResults.attending} name='entree' onChange={onInputChange} value={personInfoUpdateResults.entree}>
          {Object.keys(EntreeTypes).map((key) => {
            return <option key={'EntreeTypes-' + uniqueName + '-' + key} value={key}>{key}</option>
          })}
        </Form.Select>
        <Form.Label hidden={!personInfoUpdateResults.attending}>Vaccination Status</Form.Label>
        <Form.Select hidden={!personInfoUpdateResults.attending} name='vaxStatus' onChange={onInputChange} value={personInfoUpdateResults.vaxStatus}>
          {Object.keys(VaxStatuses).map((key, value) => {
            return <option key={'VaxStatuses-' + uniqueName + '-' + key} value={key}>{Object.values(VaxStatuses)[value]}</option>
          })}
        </Form.Select>
      </Form.Group>
    </Form.Group>
  );
}
