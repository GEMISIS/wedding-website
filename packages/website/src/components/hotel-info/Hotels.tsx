import { Col, Container, Row } from "react-bootstrap"
import { HotelInfo } from "../../types";
import { HotelInfoList } from "./HotelInfoList";
import { HotelMaps } from "./HotelMaps";
const config = require('../../config.json');

export function Hotels() {
  const hotelInfo: HotelInfo = config.hotelInfo;
  return (
    <Container>
      <Row>
        <Col md={6}>
          <img className="hotel-image" alt="" src={hotelInfo.previewImage} />
          <p>
            We have a discounted group rate at {hotelInfo.hotels.length} hotels {hotelInfo.bookStart} through {hotelInfo.bookEnd}:
          </p>
          <HotelInfoList hotels={hotelInfo.hotels} />
          <p>
            Please make your reservation by {hotelInfo.deadline}. These are on a first-come first-serve basis, so once the rooms reserved are filled up or the date to reserve has passed, you will no longer be able to reserve a room.
          </p>
        </Col>
        <Col md={6}>
          <HotelMaps hotels={hotelInfo.hotels} />
        </Col>
      </Row>
    </Container>
  )
}
