import { Button, Modal } from "react-bootstrap";
import { PersonInfo } from "../../types";
import { PersonRegistration } from "./PersonRegistration";

interface PersonModalProps {
  personInfo: PersonInfo;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onChange: (personInfo: PersonInfo) => void;
}

export function PersonModal(props: PersonModalProps) {
  return (
    <Modal show={props.visible} onHide={() => props.setVisible(false)} size='lg' aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.personInfo.firstName} {props.personInfo.lastName}{(props.personInfo.lastName ?? '').endsWith('s') ? `'` : `'s`} Registration Info
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PersonRegistration personInfo={props.personInfo} onChange={props.onChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.setVisible(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
