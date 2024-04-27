import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrailCard from "../components/TrailCard";
import MapComponent from "../components/MapComponent";
import Trail1 from "../assets/images/trail1.jpeg";
import Trail2 from "../assets/images/trail2.jpg";
import Trail3 from "../assets/images/trail3.jpg";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  DropdownButton,
  Dropdown,
  Carousel,
} from "react-bootstrap";
import { supabase } from "../client";

// eslint-disable-next-line react/prop-types
const Home = ({ trails, setTrails, isMapLoaded, userLocation, visits }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [filterOption, setFilterOption] = useState("");
  const [sortOption, setSortOption] = useState("Sort by");
  // const [weather, setWeather] = useState({ temp: 0, description: "" });

  const router = useNavigate();

  // // Fetch user location and trails when the component mounts
  // useEffect(() => {
  //   const fetchUserLocationAndTrails = async () => {
  //     try {
  //       const location = await getUserLocation();
  //       const fetchedTrails = await fetchTrails();
  //       const trailsWithDistance = calculateDistances(fetchedTrails, location);
  //       setTrails(trailsWithDistance);
  //     } catch (error) {
  //       console.error("Error initializing data:", error);
  //     }
  //   };

  //   fetchUserLocationAndTrails();
  // }, []); // Run only once when the component mounts

  // // Fetch visits when the component mounts
  // useEffect(() => {
  //   const fetchVisits = async () => {
  //     const { data, error } = await supabase.from("Visits").select("*");
  //     if (error) {
  //       console.error("Error fetching visits: ", error.message);
  //       throw error;
  //     }
  //     setVisits(data);
  //   };
  //   fetchVisits();
  // }, []);

  // const getUserLocation = () => {
  //   return new Promise((resolve, reject) => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const location = {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //           };
  //           setUserLocation(location);
  //           resolve(location);
  //         },
  //         (error) => {
  //           console.error("Error getting location: ", error);
  //           reject(error);
  //         }
  //       );
  //     } else {
  //       console.error("Geolocation is not supported by this browser.");
  //       reject(new Error("Geolocation is not supported by this browser."));
  //     }
  //   });
  // };

  // const fetchTrails = async () => {
  //   const { data, error } = await supabase.from("Trails").select("*");
  //   if (error) {
  //     console.error("Error fetching trails: ", error.message);
  //     throw error;
  //   }
  //   return data;
  // };

  // const calculateDistances = (trails, userLocation) => {
  //   return trails.map((trail) => ({
  //     ...trail,
  //     distanceAway: getDistanceFromLatLonInMiles(
  //       userLocation.lat,
  //       userLocation.lng,
  //       trail.location.lat,
  //       trail.location.lng
  //     ),
  //   }));
  // };

  // const getDistanceFromLatLonInMiles = (lat1, lon1, lat2, lon2) => {
  //   const R = 3958.8; // Radius of the Earth in miles
  //   const dLat = deg2rad(lat2 - lat1);
  //   const dLon = deg2rad(lon2 - lon1);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(deg2rad(lat1)) *
  //       Math.cos(deg2rad(lat2)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c; // Distance in miles
  // };

  // const deg2rad = (deg) => {
  //   return deg * (Math.PI / 180);
  // };

  // fetch the weather of the trail location using the open weather map api
  // useEffect(() => {}, []);

  // sort the trails based on sort options
  // sort options: rating, difficulty, length, recently added, upvotes, most visits
  const sortTrails = (sortKey) => {
    let sortedTrails = [...trails];
    switch (sortKey) {
      case "difficulty":
        sortedTrails.sort((a, b) => b.difficulty - a.difficulty);
        break;
      case "length":
        sortedTrails.sort((a, b) => b.length - a.length);
        break;
      case "rating":
        sortedTrails.sort((a, b) => b.rating - a.rating);
        break;
      case "recently added":
        sortedTrails.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "upvotes":
        sortedTrails.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "most visits":
        sortedTrails.sort((a, b) => b.visits - a.visits);
        break;
      default:
        break;
    }
    setTrails(sortedTrails);
    setSortOption(sortKey.charAt(0).toUpperCase() + sortKey.slice(1)); // Update sort option to reflect current sort
  };

  return (
    <>
      <Carousel className="mb-3">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Trail1}
            alt="First slide"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Find Your Next Adventure</h3>
            <p>
              Explore the best trails around you or plan your next hiking trip!
            </p>
            <Button variant="primary" onClick={() => router("/add-trail")}>
              Add Trail
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Trail2}
            alt="Second slide"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Find Your Next Adventure</h3>
            <p>
              Explore the best trails around you or plan your next hiking trip!
            </p>
            <Button variant="primary" onClick={() => router("/add-trail")}>
              Add Trail
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Trail3}
            alt="Third slide"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Find Your Next Adventure</h3>
            <p>
              Explore the best trails around you or plan your next hiking trip!
            </p>
            <Button variant="primary" onClick={() => router("/add-trail")}>
              Add Trail
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <MapComponent
        isMapLoaded={isMapLoaded}
        trails={trails}
        userLocation={userLocation}
      />
      <Container fluid className="mt-5">
        <Row>
          <Col md={12}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search trails"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <DropdownButton
                as={InputGroup.Append}
                variant="outline-secondary"
                title={sortOption}
                id="input-group-dropdown-2"
                onSelect={sortTrails}
              >
                <Dropdown.Item eventKey="difficulty">Difficulty</Dropdown.Item>
                <Dropdown.Item eventKey="length">Length</Dropdown.Item>
                <Dropdown.Item eventKey="rating">Rating</Dropdown.Item>
                <Dropdown.Item eventKey="recently added">
                  Recently Added
                </Dropdown.Item>
                <Dropdown.Item eventKey="upvotes">Upvotes</Dropdown.Item>
                <Dropdown.Item eventKey="most visits">
                  Most Visits
                </Dropdown.Item>
              </DropdownButton>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSortOption("Sort by");
                  setTrails([...trails]); // Reset sort
                }}
              >
                Reset
              </Button>
              <Button variant="success" onClick={() => router("/add-trail")}>
                Add Trail
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          {trails &&
            trails.length > 0 &&
            trails
              .filter((trail) =>
                searchQuery.toLowerCase() === ""
                  ? trail
                  : trail.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((trail) => (
                <Row key={trail.id}>
                  <TrailCard
                    trail={trail}
                    userLocation={userLocation}
                    visits={visits}
                  />
                </Row>
              ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
