import { Button, Card } from "react-bootstrap";
import { EntreeEntry, PersonInfo, VaxStatuses } from "../../types"
const config = require('../../config.json');

interface PersonCardProps {
  personInfo: PersonInfo;
  personIndex: number;
  onUpdateButtonClick: () => void;
}

export function PersonCard(props: PersonCardProps) {
  const entreeEntries: EntreeEntry[] = config.entreeEntries ?? [];
  const vaxStatus: VaxStatuses = props.personInfo.vaxStatus ?? 'Unknown' as VaxStatuses;
  return (
    <div className="family-member-card" id={props.personIndex.toString()} key={props.personIndex}>
      <Card id={props.personIndex.toString()} key={props.personIndex}>
        <Card.Body>
          <Card.Title>{props.personInfo.firstName} {props.personInfo.lastName}</Card.Title>
          <Card.Text>
            <b>Attending:</b> {props.personInfo.attending ?? 'Unknown'}
            <br />
            <b>Is a child:</b> {props.personInfo.isChild ? 'Yes' : 'No'}
            <br />
            <b>Entree Selection:</b> {(props.personInfo.entree && props.personInfo.entree > -1) ? entreeEntries[props.personInfo.entree].name : 'Not Selected'}
            <br />
            <b>Vaccination Status:</b> {VaxStatuses[vaxStatus as unknown as keyof typeof VaxStatuses]}
          </Card.Text>
          <Button onClick={props.onUpdateButtonClick}>Update Registration</Button>
        </Card.Body>
      </Card>
    </div>
  )
}
