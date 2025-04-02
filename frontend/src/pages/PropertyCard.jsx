import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/property/${property.id}`}>
        <img 
          src={property.image || '/default-property.jpg'} 
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-[#e48f44]">{property.name}</h3>
          <p className="text-gray-600">{property.location}</p>
          <p className="font-bold mt-2">{property.price}</p>
        </div>
      </Link>
    </div>
  );
}

export default PropertyCard;