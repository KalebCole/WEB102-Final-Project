import { supabase } from "../client";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const TrailAdd = ({ isMapLoaded, userLocation }) => {
  const [address, setAddress] = useState("");
  const [mapLocation, setMapLocation] = useState(
    userLocation.lat && userLocation.lng
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : { lat: 37.7749, lng: -122.4194 } // Default to San Francisco, or any valid location
  );
  const [trail, setTrail] = useState({
    name: "",
    description: "",
    length: "",
    difficulty: "",
    location: {},
  });
  const router = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
        setTrail({ ...trail, image: e.target.files[0] });
    }
  };

  // handle the geocoding of the address
  const handleGeocode = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${import.meta.env.VITE_REACT_APP_GOOGLE_MAP_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      setTrail({
        ...trail,
        location: { lat: location.lat, lng: location.lng },
      });
      setMapLocation({ lat: location.lat, lng: location.lng });
    }
  };

  const handleChange = (e) => {
    setTrail({ ...trail, [e.target.name]: e.target.value });
  };
  const onMapClick = (e) => {
    setMapLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    // Update the location input field if necessary
    setTrail({
      ...trail,
      location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    });
  };

  const createTrail = async (e) => {
    e.preventDefault();
    // i need to upload the image to my supabase storage
    if (trail.image) {
        const fileExt = trail.image.name.split('.').pop();
        const fileName = `trail-${Date.now()}.${fileExt}`; // Ensure a unique filename based on the timestamp
        const filePath = `${fileName}`; // Updated filePath
    
        // Upload image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("Trail Images")
          .upload(filePath, trail.image);
    
        if (uploadError) {
          console.error("Upload error:", uploadError);
          return;
        }
    
        // Manually construct the public URL
        const publicURL = `https://qquddfzyzzxocsqqlgur.supabase.co/storage/v1/object/public/Trail Images/${filePath}`;
        const encodedPublicURL = encodeURI(publicURL);
  
        const locationObj = {"lat": location.lat, "lng": location.lng};
        // Insert a row in your database table
        const { data: insertData, error: insertError } = await supabase
          .from('Trails')
          .insert([
            {
              image_url: encodedPublicURL,
                name: trail.name,
              location: locationObj,
                description: trail.description,
                difficulty: trail.difficulty,
                length: trail.length
            },
          ], { returning: 'minimal' });
    
        if (insertError) {
          console.error('Insert error:', insertError);
          return;
        }
    
      router("/");
    }
  };
  return (
    <>
    <Container>
      <h1>Add a Trail</h1>
      <Form>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" onChange={handleChange} />
        </Form.Group>
        <Row>
            <Form.Label>Address</Form.Label>
            <Col>
              <Form.Control type="text" name="address" onChange={(e) => setAddress(e.target.value)} />
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={handleGeocode}>Find on the map!</Button>
            </Col>
          </Row>
        <Form.Group controlId="location">
          {isMapLoaded ? (
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%" }}
              center={{ lat: mapLocation.lat, lng: mapLocation.lng }}
              zoom={10}
            >
              <Marker
                position={{ lat: mapLocation.lat, lng: mapLocation.lng }}
              />
            </GoogleMap>
          ) : (
            <p>Loading map...</p>
          )}
        </Form.Group>
        <Form.Group controlId="length">
          <Form.Label>Length</Form.Label>
          <Form.Control type="text" name="length" onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="difficulty">
          <Form.Label>Difficulty</Form.Label>
          <Form.Control type="text" name="difficulty" onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="formImage">
        <Form.Label>Image:</Form.Label>
        <Form.Control type="file" onChange={handleImageChange} />
      </Form.Group>
        <Row>
          <Col>
            <Button variant="secondary" onClick={() => router("/")}>Back</Button>
          </Col>
          <Col className="text-right">
            <Button variant="primary" type="submit" onClick={createTrail}>Submit</Button>
          </Col>
        </Row>
      </Form>
    </Container>
    
    </>
  );
};

export default TrailAdd;
