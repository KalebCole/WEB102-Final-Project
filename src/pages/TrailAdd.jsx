import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const TrailAdd = () => {
    const [trail, setTrail] = useState({
        name: '',
        description: '',
        length: '',
        difficulty: ''
        
    })
    const router = useNavigate();

    const handleChange = (e) => {
        setTrail({...trail, [e.target.name]: e.target.value});
    }

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