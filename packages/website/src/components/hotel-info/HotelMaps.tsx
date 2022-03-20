import { Container, Row } from "react-bootstrap";
import { Hotel } from "../../types"

interface HotelMapsProps {
  hotels: Hotel[];
}

export function HotelMaps(props: HotelMapsProps) {
  return (
    <Container>
      {props.hotels.map((hotel, index) => {
        return (
          <Row key={index} md={6 / props.hotels.length} style={{ marginBottom: '5%' }}>
            <iframe title={hotel.name} className="map-view" style={{ width: '100%', height: `${50 / props.hotels.length}vh` }} loading="lazy" allowFullScreen src={hotel.mapUrl}></iframe>
          </Row>
        )
      })}
    </Container>
  )
}
