import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

interface NotificationModalProps {
  title: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children: ReactNode;
}

export function NotificationModal(props: NotificationModalProps) {
  return (
    <Modal show={props.visible} onHide={() => props.setVisible(false)} size='lg' aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.setVisible(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
