import { Button, Modal } from "react-bootstrap";
import { PersonInfo } from "../types";

interface VaccinationCardProps {
  show: boolean;
  setVisible: (visible: boolean) => (void);
  personInfo: PersonInfo;
  onChange: (personInfo: PersonInfo) => void;
}

export function VaccinationCard(props: VaccinationCardProps) {
  return (
    <Modal show={props.show} onHide={() => props.setVisible(false)} size='lg' aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload Vaccination for {props.personInfo.firstName} {props.personInfo.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>Vaccination Status: {(props.personInfo.vaxCard != undefined && props.personInfo.vaxCard != '') ? 'Uploaded' : 'Please Upload'}</b>
        <br />
        <Button>Upload</Button>   <Button>Take Photo</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.setVisible(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
