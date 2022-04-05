import { Col, Container, Row } from "react-bootstrap"
import { TransportationInfo } from "../../types";
import { TransportationInfoList } from "./TransportationInfoList";
const config = require('../../config.json');

export function Transportation() {
  const transportationInfo: TransportationInfo = config.transportationInfo;
  return (
    <Container>
      <img className="transportation-image" alt="" src={transportationInfo.previewImage} />
      <br />
      {transportationInfo.methodsOfTransport.length > 1 ? (
        <p>
          We have a discounted group rate at {transportationInfo.methodsOfTransport.length} {transportationInfo.methodsOfTransport.length > 1 ? 'companies' : 'company'}:
        </p>
      ) : ''
      }
      <TransportationInfoList methodsOfTransport={transportationInfo.methodsOfTransport} />
    </Container>
  )
}
