interface PersonModalProps {
  myname: string;
}

export function PersonModal(props: PersonModalProps) {
  return (
    <div>
      Hello {props.myname}
    </div>
  )
}
