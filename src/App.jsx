import './App.css'
import { useEffect, useState } from 'react'
import {Home, TrailEdit, TrailDetail, TrailAdd, VisitAdd} from './pages'
import { Link, useRoutes } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";

function App() {
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

  const routes = useRoutes([
    { path: "/", element: <Home isMapLoaded={isLoaded} userLocation={userLocation}/> },
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
