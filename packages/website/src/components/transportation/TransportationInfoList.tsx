import { MethodOfTransport } from "../../types";

interface TransportationInfoListProps {
  methodsOfTransport: MethodOfTransport[];
}

export function TransportationInfoList(props: TransportationInfoListProps) {
  return props.methodsOfTransport.length > 1 ? (
    <ul>
      {props.methodsOfTransport.map((methodOfTransportation, index) => {
        const discountAmountText = methodOfTransportation.isFree ? 'for free' : 'for a discount';
        const locationsText = methodOfTransportation.validLocations.length > 1 ?
          `${discountAmountText} between the following locations with the code ${methodOfTransportation.couponCode}:` :
          `to and from ${methodOfTransportation.validLocations[0]} ${discountAmountText} with the code ${methodOfTransportation.couponCode}.`;
        const locationsList = methodOfTransportation.validLocations.length > 1 ? (
          <ul>
            {methodOfTransportation.validLocations.map((location, index2) => {
              return (
                <li id={`${index2.toString()}`} key={index2}>
                  {location}
                </li>
              )
            })}
          </ul>
        ) : '';
        return (
          <li id={`${index.toString()}`} key={index}>
            {methodOfTransportation.brandName} - Valid starting <b>{methodOfTransportation.validStarting}</b> and ends <b>{methodOfTransportation.validEnding}</b>. You can use it to travel {locationsText}{locationsList}
          </li>
        )
      })}
    </ul>
  ) : (
      <div>
        {props.methodsOfTransport.map((methodOfTransportation, index) => {
          const discountAmountText = methodOfTransportation.isFree ? 'for free' : 'for a discount';
          const locationsText = methodOfTransportation.validLocations.length > 1 ?
            `${discountAmountText} between the following locations with the code ${methodOfTransportation.couponCode}:` :
            `to and from ${methodOfTransportation.validLocations[0]} ${discountAmountText} with the code ${methodOfTransportation.couponCode}.`;
          const locationsList = methodOfTransportation.validLocations.length > 1 ? (
            <ul>
              {methodOfTransportation.validLocations.map((location, index2) => {
                return (
                  <li id={`${index2.toString()}`} key={index2}>
                    {location}
                  </li>
                )
              })}
            </ul>
          ) : '';
          return (
            <div id={`${index.toString()}`} key={index}>
              You can get a ride with {methodOfTransportation.brandName} starting <b>{methodOfTransportation.validStarting}</b> and ends <b>{methodOfTransportation.validEnding}</b> {locationsText}{locationsList}
            </div>
          )
        })}
      </div>
  )
}
