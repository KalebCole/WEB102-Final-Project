import './App.css'
import { useEffect, useState } from 'react'
import {Home, TrailEdit, TrailDetail, TrailAdd, VisitAdd} from './pages'
import { Link, useRoutes } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import { supabase } from "./client";

function App() {
  const [trails, setTrails] = useState([]);
  const [userLocation, setUserLocation] = useState({});


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAP_KEY,
  });

  // fetch the user's location using the browser's geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // fetch the trails from the supabase databse
  useEffect(() => {
    const fetchTrails = async () => {
      const { data, error } = await supabase.from("Trails").select("*");
      if (error) {
        console.error("Error fetching trails: ", error.message);
      } else {
        setTrails(data);
      }
    };
    fetchTrails();
  }, []);

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
    <nav>
      <h1>Trail Hub</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/add-trail">Add Trail</Link>
      </div>
    </nav>
    {routes}
      
    </>
  )
}

export default App
