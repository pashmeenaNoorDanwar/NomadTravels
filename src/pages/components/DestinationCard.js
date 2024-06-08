// components/DestinationCard.jsx
import Image from "next/image";
import Link from "next/link";

function DestinationCard({ location, description, image, pathNameParams }) {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl">
      <figure className="relative w-full min-w-[230px] max-w-[230px]">
        <Image src={image} alt={location} fill />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{location}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <Link
            href={{
              pathname: "/itinerary",
              query: {
                ...pathNameParams,
                selectedLocation: location,
              },
            }}
            className="btn btn-primary"
          >
            Generate Itinerary
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;