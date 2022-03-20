import { Container, ListGroup } from "react-bootstrap";
const config = require('../../config.json');

interface CeremonyEvent {
  name: string;
  startTime: string;
}

interface VenueInfo {
  name: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  mapUrl: string;
}

interface DayOfInfoProps {
}

export function DayOfInfo(props: DayOfInfoProps) {
  const venueInfo: VenueInfo = config.venueInfo;
  const ceremonyEvents: CeremonyEvent[] = config.schedule;
  console.log(ceremonyEvents);
  return (
    <Container style={{marginBottom: '5%'}}>
      <iframe title={venueInfo.name} className="map-view" style={{ display: 'block', width: '100%', height: `50vh` }} loading="lazy" allowFullScreen src={venueInfo.mapUrl}></iframe>
      <p style={{marginTop: '2.5%'}}>
        We will be holding the wedding on <b>{venueInfo.eventDate}</b> at <b>{venueInfo.name}</b>, beginning at <b>{venueInfo.startTime}</b> and ending at <b>{venueInfo.endTime}</b>. The schedule of events will be as follows:
      </p>
      <ListGroup style={{textAlign: 'center'}}>
        {ceremonyEvents.map(event => (
            <ListGroup.Item key={event.name}>
              {event.name}: {event.startTime}
            </ListGroup.Item>
          ))
        }
      </ListGroup>
    </Container>
  )
}
