import { Col, Container, Row } from "react-bootstrap"
const config = require('../../config.json');

interface PhoneNumber {
  url: string;
  number: string;
}

interface Hotel {
  name: string;
  url: string;
  mapUrl: string;
  phoneNumber?: PhoneNumber;
}

interface HotelInfo {
  hotels: Hotel[];
  bookStart: string;
  bookEnd: string;
  deadline: string;
  previewImage: string;
}

interface HotelsProps {
}

export function Hotels(props: HotelsProps) {
  const hotelInfo: HotelInfo = config.hotelInfo;
  return (
    <Container>
      <Row>
        <Col md={6}>
          <img className="hotel-image" alt="" src={hotelInfo.previewImage} />
          <p>We have a discounted group rate at {hotelInfo.hotels.length} hotels {hotelInfo.bookStart} through {hotelInfo.bookEnd}:
            <ul>
              {hotelInfo.hotels.map(hotel => {
                return (
                  <li>
                    Reserve a room in the {hotel.name} by clicking <a href={hotel.url}>here</a>{
                      hotel.phoneNumber ? (
                        <span> or by calling <a href={'tel:+' + hotel.phoneNumber.url}>{hotel.phoneNumber.number}</a>.</span>
                      ) : (<span>.</span>)
                    }
                  </li>
                )
              })}
            </ul>
            Please make your reservation by {hotelInfo.deadline}. These are on a first-come first-serve basis, so once the rooms reserved are filled up or the date to reserve has passed, you will no longer be able to reserve a room.
          </p>
        </Col>
        <Col md={6}>
          <Container>
            {hotelInfo.hotels.map(hotel => {
              return (
                <Row md={6 / hotelInfo.hotels.length} style={{marginBottom: '5%'}}>
                  <iframe title={hotel.name} className="map-view" style={{ width: '100%', height: `${50 / hotelInfo.hotels.length}vh`}} loading="lazy" allowFullScreen src={hotel.mapUrl}></iframe>
                </Row>
              )
            })}
          </Container>
        </Col>
      </Row>
    </Container>
  )
}
