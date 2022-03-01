interface HelloMessageProps {
  myname: string;
}

export function HelloMessage(props: HelloMessageProps) {
  return (
    <div>
      Hello {props.myname}
    </div>
  )
}
