import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../client";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
//import styles
import "../styles/main.scss";

// eslint-disable-next-line react/prop-types
const TrailEdit = ({
  isMapLoaded,
  userLocation,
  trails,
  setTrails,
  deleteTrail,
}) => {
  const router = useNavigate();
  const { id } = useParams();
  const [address, setAddress] = useState("");
  const [mapLocation, setMapLocation] = useState(
    { lat: 37.7749, lng: -122.4194 } // Default to San Francisco, or any valid location
  );
  const [trail, setTrail] = useState({
    name: "",
    description: "",
    length: "",
    difficulty: "",
    rating: "",
    image_url: "",
  });

  useEffect(() => {
    const fetchTrail = async () => {
      const { data, error } = await supabase
        .from("Trails")
        .select("*")
        .eq("id", id);
      if (error) {
        console.error("Error fetching trail: ", error.message);
      } else {
        setTrail(data[0]);
      }
    };
    fetchTrail();
  }, [id]);

  useEffect(() => {
    // when the trail updates, update the map location
    if (trail.location) {
      setMapLocation(trail.location);
    }
  }, [trail]);
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

  const onMapClick = (e) => {
    setMapLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    // Update the location input field if necessary
    setTrail({
      ...trail,
      location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    });
  };

  const handleChange = (e) => {
    setTrail({ ...trail, [e.target.name]: e.target.value });
  };

  const handleEditTrail = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedTrail = {
      name: formData.get("name"),
      difficulty: formData.get("difficulty"),
      length: formData.get("length"),
      rating: formData.get("rating"),
      description: formData.get("description"),
      image_url: trail.image_url, // maintain the original image unless a new one is uploaded
    };

    // Image uploading logic only if a new image is selected
    const image = formData.get("image");
    if (image && image.size > 0) {
      const fileExt = image.name.split(".").pop();
      const fileName = `trail-${Date.now()}.${fileExt}`; // Ensure a unique filename based on the timestamp
      const filePath = `${fileName}`;

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Trail Images")
        .upload(filePath, image);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      // Manually construct the public URL
      updatedTrail.image_url = `https://qquddfzyzzxocsqqlgur.supabase.co/storage/v1/object/public/Trail Images/${filePath}`;
    }

    const { data, error } = await supabase
      .from("Trails")
      .update(updatedTrail)
      .eq("id", id);
    if (error) {
      console.error("Error updating trail: ", error.message);
    } else {
      setTrails((trails) => {
        // Update the trail in the parent component
        const updatedTrails = trails.map((t) => (t.id === id ? data[0] : t));
        return updatedTrails;
      });
      router(`/details/${id}`);
    }
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
        <Card className="card-custom">
            <Card.Body className="test">
              <Card.Title>Edit Trail</Card.Title>
              <Form onSubmit={handleEditTrail}>
                <Form.Group controlId="formTrailName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={trail.name}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTrailDifficulty">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Control
                    type="text"
                    name="difficulty"
                    defaultValue={trail.difficulty}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTrailDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    defaultValue={trail.description}
                    required
                  />
                </Form.Group>
                <Row>
                  <Form.Label>Address</Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      name="address"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button variant="primary" onClick={handleGeocode}>
                      Find on the map!
                    </Button>
                  </Col>
                </Row>
                <Form.Group controlId="location">
                  {isMapLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ height: "400px", width: "100%" }}
                      center={{ lat: mapLocation.lat, lng: mapLocation.lng }}
                      zoom={10}
                      onClick={onMapClick}
                    >
                      <Marker
                        key={Math.random()}
                        position={{
                          lat: mapLocation.lat,
                          lng: mapLocation.lng,
                        }}
                      />
                    </GoogleMap>
                  ) : (
                    <p>Loading map...</p>
                  )}
                </Form.Group>
                <Form.Group controlId="formTrailLength">
                  <Form.Label>Length (miles)</Form.Label>
                  <Form.Control
                    type="number"
                    name="length"
                    defaultValue={trail.length}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTrailRating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    defaultValue={trail.rating}
                    required
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </Form.Group>
                <Form.Group controlId="formImage">
                  <Form.Label>Image:</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                <Button variant="success" type="submit" className="mr-2">
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteTrail(id)}
                  className="mr-2"
                >
                  Delete Trail
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => router(`/details/${id}`)}
                >
                  Back to Trail
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={trail.image_url || "https://via.placeholder.com/400"}
              alt={trail.name}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrailEdit;
