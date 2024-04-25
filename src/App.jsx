import './App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
import {Home, TrailEdit, TrailDetail, TrailAdd, VisitAdd} from './pages'
import { Link, useRoutes } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import { supabase } from "./client";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

function App() {
  const [trails, setTrails] = useState([]);
  const [userLocation, setUserLocation] = useState({});
  const [distanceAway, setDistanceAway] = useState(0);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAP_KEY,
  });

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getDistanceAwayFromLatLonInMiles = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  // Function to fetch user's location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          resolve(location);  // Resolve the promise with the location
        }, (error) => {
          console.error("Error getting location: ", error);
          reject(error);  // Reject the promise if there's an error
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

 // Function to fetch trails
 const fetchTrails = async () => {
  const { data, error } = await supabase.from("Trails").select("*");
  if (error) {
    console.error("Error fetching trails: ", error.message);
    return [];
  } else {
    return data;
  }
};
  
  // fetch the user's location using the browser's geolocation API
  // fetch the trails from the supabase database
  useEffect(() => {
    getUserLocation().then(location => {
      // After location is successfully obtained, fetch the trails
      fetchTrails().then(data => {
        // After trails are fetched, map the distances
        const trailsWithDistance = data.map(trail => {
          const distanceAway = getDistanceAwayFromLatLonInMiles(
            location.lat,
            location.lng,
            trail.location.lat,
            trail.location.lng
          );
          return { ...trail, distanceAway };
        });
        setTrails(trailsWithDistance);
      }).catch(error => {
        console.error("Failed to fetch trails: ", error);
      });
    }).catch(error => {
      console.error("Failed to get user location: ", error);
    });
  }, []); // Empty dependency array to run only once on component mount

  const routes = useRoutes([
    { path: "/", element: <Home trails={trails} setTrails={setTrails} isMapLoaded={isLoaded} userLocation={userLocation}/> },
    { path: "add-trail", element: <TrailAdd isMapLoaded={isLoaded} userLocation={userLocation}/>},
    { path: "/edit/:id", element: <TrailEdit /> },
    { path: "/details/:id", element: <TrailDetail /> },
    { path: "/add-visit/:id", element: <VisitAdd /> },

    { path: "*", element: <Home />}
  ]);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Trail Hub</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/add-trail">Add Trail</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {routes}
      </Container>
    </>
  );
}

export default App
