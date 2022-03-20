import { Button, Card } from "react-bootstrap";
import { PersonInfo } from "../../types"

interface PersonCardProps {
  personInfo: PersonInfo;
  personIndex: number;
  onUpdateButtonClick: () => void;
}

export function PersonCard(props: PersonCardProps) {
  return (
    <div className="family-member-card" id={props.personIndex.toString()} key={props.personIndex}>
      <Card id={props.personIndex.toString()} key={props.personIndex}>
        <Card.Body>
          <Card.Title>{props.personInfo.firstName} {props.personInfo.lastName}</Card.Title>
          <Card.Text>
            Attending: {props.personInfo.attending ?? 'Unknown'}
            <br />
            Is a child: {props.personInfo.isChild ? 'Yes' : 'No'}
            <br />
            Entree Selection: {props.personInfo.entree}
          </Card.Text>
          <Button onClick={props.onUpdateButtonClick}>Update Registration</Button>
        </Card.Body>
      </Card>
    </div>
  )
}
