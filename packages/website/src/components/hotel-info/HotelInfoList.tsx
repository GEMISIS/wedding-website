import { Hotel } from "../../types";

interface HotelInfoListProps {
  hotels: Hotel[];
}

export function HotelInfoList(props: HotelInfoListProps) {
  return (
    <ul>
      {props.hotels.map((hotel, index) => {
        return (
          <li id={`${index.toString()}`} key={index}>
            Reserve a room in the {hotel.name} by clicking <a href={hotel.url}>here</a>{
              hotel.phoneNumber ? (
                <span> or by calling <a href={'tel:+' + hotel.phoneNumber.url}>{hotel.phoneNumber.number}</a>.</span>
              ) : (<span>.</span>)
            }
          </li>
        )
      })}
    </ul>
  )
}
