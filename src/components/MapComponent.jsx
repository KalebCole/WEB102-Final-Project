import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Button, Card, Container } from 'react-bootstrap';

const MapComponent = ({ isMapLoaded, trails, userLocation }) => {
  const [selectedTrail, setSelectedTrail] = useState(null);
  const router = useNavigate();

  return (
    <Container fluid className="px-0">
      <div className="map" style={{ height: '50vh', width: '100%' }}>
        {isMapLoaded ? (
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{ lat: userLocation.lat, lng: userLocation.lng }}
            zoom={10}
          >
            {trails && trails.map((trail) => (
              console.log(trail),
              trail.location && (
                <Marker
                  key={trail.id}
                  position={{ lat: trail.location.lat, lng: trail.location.lng }}
                  onClick={() => setSelectedTrail(trail)}
                />

              )
            ))}

            {selectedTrail && (
              <InfoWindow
                position={{
                  lat: selectedTrail.location.lat,
                  lng: selectedTrail.location.lng,
                }}
                onCloseClick={() => setSelectedTrail(null)}
              >
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={selectedTrail.image_url} />
                  <Card.Body>
                    <Card.Title>{selectedTrail.name}</Card.Title>
                    <Card.Text>{selectedTrail.description}</Card.Text>
                    <Button variant="primary" onClick={(e) => {
                      e.stopPropagation();  // Prevents the InfoWindow from closing when clicking the button
                      router(`/details/${selectedTrail.id}`);
                    }}>
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </Container>
  );
};

export default MapComponent;
