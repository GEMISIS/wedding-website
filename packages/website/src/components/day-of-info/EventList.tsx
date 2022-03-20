import { ListGroup } from "react-bootstrap";
import { WeddingEvent } from "../../types";

interface EventListProps {
  events: WeddingEvent[];
}

export function EventList(props: EventListProps) {
  return (
    <ListGroup style={{ textAlign: 'center' }}>
      {props.events.filter(x => x).map(event => (
        <ListGroup.Item key={event.name}>
          {event.name}: {event.startTime}
        </ListGroup.Item>
      ))
      }
    </ListGroup>
  )
}
