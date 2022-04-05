import { Container } from "react-bootstrap";
import { VenueInfo, WeddingEvent } from "../../types";
import { EventList } from "./EventList";
const config = require('../../config.json');

export function DayOfInfo() {
  const venueInfo: VenueInfo = config.venueInfo;
  const weddingEvents: WeddingEvent[] = config.schedule;
  return (
    <Container style={{marginBottom: '5%'}}>
      <iframe title={venueInfo.name} className="map-view" style={{ display: 'block', width: '100%', height: `50vh` }} loading="lazy" allowFullScreen src={venueInfo.mapUrl}></iframe>
      <p style={{marginTop: '2.5%'}}>
        We will be holding the wedding on <b>{venueInfo.eventDate}</b> at <b>{venueInfo.name}</b>, beginning at <b>{venueInfo.startTime}</b> and ending at <b>{venueInfo.endTime}</b>. The schedule of events will be as follows:
      </p>
      <EventList events={weddingEvents} />
      <p style={{textAlign: 'center', marginTop: '2.5%', marginLeft: 'auto', marginRight: 'auto'}}>
        <b>Please note that {config.blackTie ? 'this is a black tie event.' : 'the dress code is formal attire.'}</b>
      </p>
    </Container>
  )
}
