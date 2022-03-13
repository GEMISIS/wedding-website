import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { PersonInfo } from "../types";
import { Canvas, CanvasType } from "./Canvas";

interface VaccinationCardProps {
  show: boolean;
  setVisible: (visible: boolean) => (void);
  personInfo: PersonInfo;
  onChange: (personInfo: PersonInfo) => void;
}

export function VaccinationCard(props: VaccinationCardProps) {
  const [canvasType, setCanvasType] = useState(CanvasType.UploadedImage);

  const closeModal = () => {
    props.setVisible(false);
    setCanvasType(CanvasType.UploadedImage);
  }

  return (
    <Modal show={props.show} onHide={closeModal} size='xl' aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload Vaccination for {props.personInfo.firstName} {props.personInfo.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row className="justify-content-xl-center">
            <Col>
              <Canvas canvasType={canvasType} className="imageView" />
            </Col>
          </Row>
          <br />
          <Row className="justify-content-lg-center">
            <Col md='auto'>
              <Button disabled={canvasType !== CanvasType.UploadedImage}>Upload</Button>
              &nbsp;
              <Button onClick={() => setCanvasType(CanvasType.CameraFeed)}>Take Photo</Button>
            </Col>
          </Row>
          <Row className="justify-content-lg-center">
            <Col md='auto'>
              <b>Vaccination Status: {(props.personInfo.vaxCard !== undefined && props.personInfo.vaxCard !== '') ? 'Uploaded' : 'Please Upload'}</b>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={canvasType !== CanvasType.UploadedImage} onClick={() => {
          props.onChange(props.personInfo);
          closeModal();
        }}>Save</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}
