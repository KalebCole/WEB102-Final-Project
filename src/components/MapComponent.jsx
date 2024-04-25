import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const MapComponent = ({ isMapLoaded, trails, userLocation }) => {
  const [selectedTrail, setSelectedTrail] = useState(null);
  const router = useNavigate();

  return (
    <div className="map">
        {console.log(userLocation)}
      <h2>Map</h2>
      {isMapLoaded ? (
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "800px" }}
          center={{ lat: userLocation.lat, lng: userLocation.lng }}
          zoom={10}
        >
          {trails &&
            trails.length &&
            trails.map((trail) => (
              <Marker
                key={trail.id}
                position={{ lat: trail.location.lat, lng: trail.location.lng }}
                onClick={() => setSelectedTrail(trail)}
              />
            ))}

          {selectedTrail && (
            <InfoWindow
              position={{
                lat: selectedTrail.location.lat,
                lng: selectedTrail.location.lng,
              }}
              onCloseClick={() => setSelectedTrail(null)}
            >
              <div>
                <img src={selectedTrail.image_url} alt="" style={{width:"100px"}} />
                <h4>{selectedTrail.name}</h4>
                <p>{selectedTrail.description}</p>
                <button onClick={() => router(`/details/${selectedTrail.id}`)}>
                  View Details
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};
export default MapComponent;
