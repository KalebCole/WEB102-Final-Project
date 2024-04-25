import './App.css'
import {Home, TrailEdit, TrailDetail, TrailAdd, VisitAdd} from './pages'
import { Link, useRoutes } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAP_KEY,
  });

  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "add-trail", element: <TrailAdd />},
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
