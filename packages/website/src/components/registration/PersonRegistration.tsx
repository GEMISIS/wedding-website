import { ChangeEvent, useEffect, useState } from 'react';
import { Carousel, Col, Form, Row } from 'react-bootstrap';
import { AttendingStatus, EntreeEntry, PersonInfo, VaxStatuses } from "../../types";
const config = require('../../config.json');

interface PersonRegistrationProps {
  personInfo: PersonInfo;
  onChange: (personInfo: PersonInfo) => void;
}

export function PersonRegistration(props: PersonRegistrationProps) {
  const [personInfoUpdateResults, setPersonInfoUpdateResults] = useState<PersonInfo>(props.personInfo);
  const entreeEntries: EntreeEntry[] = config.entreeEntries ?? [];

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

        <Row>
          <Col md={6}>
            <Carousel className='entreeCarousel' controls={true} indicators={true} variant='dark'>
              {entreeEntries.map(entree => {
                return (
                  <Carousel.Item className='entreeCarouselEntry'>
                    <h5>{entree.name ?? 'Demo Slide Label'}</h5>
                    <p>{entree.description ?? 'Description here'}</p>
                  </Carousel.Item>
                )                
              })}
            </Carousel>
          </Col>
          <Col md={6} style={{alignContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '5%'}}>
            <Form.Label>Attending?
              <Form.Select name='attending' onChange={onInputChange} value={personInfoUpdateResults.attending}>
                {Object.keys(AttendingStatus).map((key, value) => {
                  return <option key={'AttendingStatus-' + uniqueName + '-' + key} value={key}>{Object.values(AttendingStatus)[value]}</option>
                })}
              </Form.Select>
            </Form.Label>
            <br />
            <Form.Label>Child?
              <Form.Check type='checkbox' name='isChild' onChange={onInputChange} defaultChecked={personInfoUpdateResults.isChild ?? false} />
            </Form.Label>
          </Col>
        </Row>

        <Form.Label>Entree Selection</Form.Label>
        <Form.Select name='entree' onChange={onInputChange} value={personInfoUpdateResults.entree ?? -1}>
          <option key={-1} value={-1}>Not Selected</option>
          {entreeEntries.map((value, index) => {
            return <option key={index} value={index}>{value.name}</option>
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
