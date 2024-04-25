import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import TrailCard from "../components/TrailCard";
import MapComponent from "../components/MapComponent";

const Home = ({trails, setTrails, isMapLoaded, userLocation}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [trailLocation, setTrailLocation] = useState({ city: "", country: "" });
  const [weather, setWeather] = useState({ temp: 0, description: "" });

  const router = useNavigate();

  

  

  // fetch the city and country of trail location using the google maps api
  useEffect(() => {}, []);

  // fetch the weather of the trail location using the open weather map api
  useEffect(() => {}, []);


  // filter the trails based on filter options
  // filter options: difficulty, length, rating, search
//   const filterTrails = async (filters) => {
//     let filteredTrails = [...trails];
  
//     if (filters.name) {
//       if (filters.name === "difficulty") {
//         filteredTrails = filteredTrails.filter((trail) => trail.difficulty === 1);
//       } else if (filters.name === "length") {
//         filteredTrails = filteredTrails.filter((trail) => trail.length < 5);
//       } else if (filters.name === "rating") {
//         filteredTrails = filteredTrails.filter((trail) => trail.rating > 4);
//       }
//     }
  
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filteredTrails = filteredTrails.filter((trail) => 
//         trail.name.toLowerCase().includes(searchLower)
//       );
//     }
  
//     setTrails(filteredTrails);
//   };

  // sort the trails based on sort options
  // sort options: rating, difficulty, length, recently added, upvotes, most visits
  const sortTrails = async (name) => {
      let sortedTrails = [...trails] ;
      console.log(sortedTrails)
    if (name === "difficulty") {
      sortedTrails = sortedTrails.sort((a, b) => b.difficulty - a.difficulty);
    } else if (name === "length") {
      sortedTrails = sortedTrails.sort((a, b) => b.length - a.length);
    } else if (name === "rating") {
      sortedTrails = sortedTrails.sort((a, b) => b.rating - a.rating);
    } else if (name === "recently added") {
      sortedTrails = sortedTrails.sort((a, b) => b.created_at - a.created_at);
    } else if (name === "upvotes") {
      sortedTrails = sortedTrails.sort((a, b) => b.upvotes - a.upvotes);
    } else if (name === "most visits") {
      sortedTrails = sortedTrails.sort((a, b) => b.visits - a.visits);
    }
    setTrails(sortedTrails);
  };

  return (
    <>
    <h1>Home</h1>
    <MapComponent isMapLoaded = {isMapLoaded} trails={trails} userLocation={userLocation}/>
    {/* filters and trails list */}
    <div className="filters">
      <input
        type="text"
        placeholder="Search trails"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* <select
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
      >
        <option value="">Filter by</option>
        <option value="difficulty">Difficulty</option>
        <option value="length">Length</option>
        <option value="rating">Rating</option>
      </select>
      <button onClick={() => filterTrails({ name: filterOption, search: searchQuery })}>
        Filter
      </button> */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="difficulty">Difficulty</option>
        <option value="length">Length</option>
        <option value="rating">Rating</option>
        <option value="recently added">Recently Added</option>
        <option value="upvotes">Upvotes</option>
        <option value="most visits">Most Visits</option>
      </select>
      <button onClick={() => sortTrails(sortOption)}>Sort</button>
      <button onClick={() => setSortOption("")}>Reset</button>
      <button onClick={() => router("/add-trail")}>Add Trail</button>
    </div>
    <div className="trails">
      {trails && trails.length && trails.filter(trail => {
        return(
            searchQuery.toLowerCase() === "" ? trail : trail.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }).
      map((trail) => (
        <TrailCard key={trail.id} trail={trail} userLocation={userLocation} />
      ))}
    </div>
    </>
  );
};

export default Home;
