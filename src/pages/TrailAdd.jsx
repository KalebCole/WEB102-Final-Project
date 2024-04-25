import { supabase } from "../client";
import { useNavigate } from "react-router-dom";
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
    const { data, error } = await supabase.from("Trails").insert({
      name: trail.name,
      description: trail.description,
      length: trail.length,
      difficulty: trail.difficulty,
    });
    if (error) {
      console.error("Error creating trail: ", error.message);
    } else {
      router("/");
    }
  };
  return (
    <div>
      <h1>Add a Trail</h1>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" onChange={handleChange} />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
        ></textarea>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={handleGeocode}>Geocode</button>
        <label htmlFor="location">Location</label>
        {isMapLoaded ? (
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "800px" }}
            center={{ lat: mapLocation.lat, lng: mapLocation.lng }}
            zoom={10}
            onClick={onMapClick}
          >
              <Marker
                key={1}
                position={{ lat: mapLocation.lat, lng: mapLocation.lng }}
              />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}

        <label htmlFor="length">Length</label>
        <input type="text" id="length" name="length" onChange={handleChange} />
        <label htmlFor="difficulty">Difficulty</label>
        <input
          type="text"
          id="difficulty"
          name="difficulty"
          onChange={handleChange}
        />
        <label htmlFor="image" className="image">
          Image
        </label>
        <input type="file" id="image" name="image" />
        <button onClick={() => router("/")}>Back</button>
        <button type="submit" onClick={createTrail}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default TrailAdd;
