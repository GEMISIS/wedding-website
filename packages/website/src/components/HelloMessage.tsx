interface HelloMessageProps {
  myname: string;
}

function HelloMessage(props: HelloMessageProps) {
  return (
    <div>
      Hello {props.myname}
    </div>
  )
}

export default HelloMessage;
