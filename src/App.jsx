import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import { useEffect, useState } from 'react';
import { Home, TrailEdit, TrailDetail, TrailAdd, VisitAdd } from './pages';
import { useRoutes, useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import { supabase } from "./client";
import { Navbar, Nav, Container } from 'react-bootstrap';

function App() {
    const [trails, setTrails] = useState([]);
    const [visits, setVisits] = useState([]);
    const [userLocation, setUserLocation] = useState({});
    const router = useNavigate();
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAP_KEY,
    });

    // Fetch user location and trails when the component mounts
    useEffect(() => {
        const fetchUserLocationAndTrails = async () => {
            try {
                const location = await getUserLocation();
                const fetchedTrails = await fetchTrails();
                const trailsWithDistance = calculateDistances(fetchedTrails, location);
                setTrails(trailsWithDistance);
            } catch (error) {
                console.error("Error initializing data:", error);
            }
        };

        fetchUserLocationAndTrails();
    }, []); // Run only once when the component mounts

    // Fetch visits when the component mounts
    useEffect(() => {
        const fetchVisits = async () => {
            const { data, error } = await supabase.from("Visits").select("*");
            if (error) {
                console.error("Error fetching visits: ", error.message);
                throw error;
            }
            setVisits(data);
        };
        fetchVisits();  
      }, []);

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(location);
                    resolve(location);
                }, (error) => {
                    console.error("Error getting location: ", error);
                    reject(error);
                });
            } else {
                console.error("Geolocation is not supported by this browser.");
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    };

    const fetchTrails = async () => {
        const { data, error } = await supabase.from("Trails").select("*");
        if (error) {
            console.error("Error fetching trails: ", error.message);
            throw error;
        }
        return data;
    };

    const calculateDistances = (trails, userLocation) => {
        return trails.map(trail => ({
            ...trail,
            distanceAway: getDistanceFromLatLonInMiles(
                userLocation.lat,
                userLocation.lng,
                trail.location.lat,
                trail.location.lng
            )
        }));
    };

    const getDistanceFromLatLonInMiles = (lat1, lon1, lat2, lon2) => {
        const R = 3958.8; // Radius of the Earth in miles
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in miles
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };
    const deleteTrail = async (trailId) => { 
        console.log("Deleting trail...")
        if (!window.confirm("Are you sure you want to delete this trail?")) {
            return;
        }
    
        // Delete visits associated with the trail
        const { error: visitError } = await supabase
          .from("Visits")
          .delete()
          .eq("trail_id", trailId);
    
        if (visitError) {
          console.error("Error deleting visits: ", visitError.message);
        } else {
          console.log(`Deleted visits.`);
        }
    
        const { error } = await supabase.from("Trails").delete().eq("id", trailId);
        if (error) {
          console.error("Error deleting trail: ", error.message);
        } else {
          setTrails(trails.filter((trail) => trail.id !== trailId));
          router("/");
          window.location.reload();
        }
    };
    const routes = useRoutes([
        { path: "/", element: <Home trails={trails} setTrails={setTrails} isMapLoaded={isLoaded} userLocation={userLocation} visits={visits} /> },
        { path: "/add-trail", element: <TrailAdd isMapLoaded={isLoaded} userLocation={userLocation} setTrails={setTrails} /> },
        { path: "/edit/:id", element: <TrailEdit isMapLoaded={isLoaded} userLocation={userLocation} trails={trails} setTrails={setTrails} deleteTrail={deleteTrail} /> },
        { path: "/details/:id", element: <TrailDetail /> },
        { path: "/add-visit/:id", element: <VisitAdd /> },
        { path: "*", element: <Home trails={trails} isMapLoaded={isLoaded} userLocation={userLocation} /> }
    ]);

    return (
        <>
          <Navbar className="navbar-custom"  expand="lg">
            <Container>
              <Navbar.Brand href="/">Trail Connect</Navbar.Brand>
              {/* home link */}
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <Container>
            {routes}
          </Container>
        </>
      );
    }
          
export default App;
