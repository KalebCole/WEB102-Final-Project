import { useNavigate } from "react-router-dom";
const TrailCard = ({ trail, userLocation }) => {
    const router = useNavigate();
    return (
        <div className="trail-card" onClick={() => router(`/details/${trail.id}`)}>
        <img src={trail.image_url} alt={trail.name} style={{width: "200px"} } />
        <h2>{trail.name}</h2>
        <p>{trail.difficulty}</p>
        <p>{trail.length} miles</p>
        <p>{trail.rating} stars</p>
        <p>{trail.visits} visits</p>
        <p>{trail.upvotes} upvotes</p>
        </div>
    );
};

export default TrailCard;