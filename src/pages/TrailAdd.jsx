import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    GoogleMap,
    LoadScript,
    Marker,
    useJsApiLoader,
  } from "@react-google-maps/api";

const TrailAdd = ({isMapLoaded, userLocation}) => {
    const [trail, setTrail] = useState({
        name: '',
        description: '',
        length: '',
        difficulty: '',
        location: {}  
    })
    const [selectedPosition, setSelectedPosition] = useState(null);
    const router = useNavigate();

    const handleChange = (e) => {
        setTrail({...trail, [e.target.name]: e.target.value});
    }
    const onMapClick = (e) => {
        setSelectedPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        // Update the location input field if necessary
        setTrail({...trail, location: { lat: e.latLng.lat(), long: e.latLng.lng() }});
        console.log(trail.location);
      };

    const createTrail = async (e) => {
        e.preventDefault();
        const {data, error} = await supabase.from('Trails').insert({
            name: trail.name,
            description: trail.description,
            length: trail.length,
            difficulty: trail.difficulty
        });
        if (error) {
            console.error('Error creating trail: ', error.message);
        } else {
            router('/');
        }
    }
    return (
        <div>
        <h1>Add a Trail</h1>
        <form>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" onChange={handleChange} />
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" onChange={handleChange}></textarea>
            <label htmlFor="location">Location</label>
            {
                isMapLoaded ? <GoogleMap mapContainerStyle={{ height: "400px", width: "800px" }} center={{ lat: 45.4211, lng: -75.6903 }} zoom={10} onClick={onMapClick}>
                {selectedPosition && <Marker position={selectedPosition} />}
            </GoogleMap>
            : <p>Loading map...</p>

            }
            
            <label htmlFor="length">Length</label>
            <input type="text" id="length" name="length" onChange={handleChange}/>
            <label htmlFor="difficulty">Difficulty</label>
            <input type="text" id="difficulty" name="difficulty" onChange={handleChange}/>
            <label htmlFor="image" className="image">Image</label>
            <input type="file" id="image" name="image" />
            <button onClick={() => router('/')}>Back</button>
            <button type="submit" onClick={createTrail}>Submit</button>
        </form>
        </div>
    )
    };

export default TrailAdd;