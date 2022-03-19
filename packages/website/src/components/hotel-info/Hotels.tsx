import { Col, Container, Row } from "react-bootstrap"
const config = require('../../config.json');
const mapsApiKey: string = config.mapsApiKey

interface HotelsProps {
}

export function Hotels(props: HotelsProps) {
  return (
    <Container>
      <Row>
        <Col className="col-md-6">
          <img className="hotel-image" src="https://hotelindigooldtownalexandria.com/wp-content/uploads/2021/05/IndigoAlex18_2213.jpg.webp" />
          <p>Testing hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello worldTesting hello world</p>
        </Col>
        <Col className="col-md-6">
          <iframe className="map-view" loading="lazy" allowFullScreen src={"https://www.google.com/maps/embed/v1/place?q=place_id:ChIJR_wUDviwt4kRTXJ2-1aFsjo&key=" + mapsApiKey}></iframe>
        </Col>
      </Row>
    </Container>
  )
}
