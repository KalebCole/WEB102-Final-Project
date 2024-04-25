import {useParams, useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";
import { supabase } from "../client";

const TrailDetail = () => {
    const {id} = useParams();
    const router = useNavigate();
    const [trail, setTrail] = useState({});
    const [visits, setVisits] = useState([]);
    
    const increaseUpvotes = async () => {
        const newUpvotes = trail.upvotes + 1;
        setTrail({...trail, upvotes: newUpvotes});

        const {data, error} = await supabase.from('Trails').update({upvotes: newUpvotes}).eq('id', id);
        if (error) {
            console.error('Error updating upvotes: ', error.message);
        }
    };

    useEffect(() => {
        const fetchTrail = async () => {
            const {data, error} = await supabase.from('Trails').select('*').eq('id', id);
            if (error) {
                console.error('Error fetching trail: ', error.message);
            } else {
                setTrail(data[0]);
            }
        };
        const fetchVisits = async () => {
            const {data, error} = 
            await supabase.from('Visits').select('*').eq('trail_id', id);
            if (error) {
                console.error('Error fetching visits: ', error.message);
            } else {
                setVisits(data);
            }
        }
        fetchTrail();
        fetchVisits();
    }, [id]);

    return (
        <div className="detail">
            <button onClick={increaseUpvotes}>{trail.upvotes} 👆</button>
            <h1>{trail.name}</h1>
            <img src={trail.image_url} alt={trail.name} />
            <p>{trail.difficulty}</p>
            <p>{trail.length} miles</p>
            <p>{trail.rating} stars</p>
            <p>{trail.visits} visits</p>
            <p>{trail.upvotes} upvotes</p>
            <h2>Visits</h2>
            <button onClick={() => router(`/add-visit/${trail.id}`)}>Add Visit</button>
            <div>
                {visits.map((visit) => (
                    <div key={visit.id}>
                        <h3>{visit.name}</h3>
                        <p>{visit.date}</p>
                        <p>{visit.comment}</p>
                    </div>
                ))}


            </div>
            <button onClick={() => router(`/edit/${trail.id}`)}>Edit Trail</button>
        </div>
    );
}

export default TrailDetail;