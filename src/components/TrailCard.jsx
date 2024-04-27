import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TrailCard = ({ trail, userLocation, visits }) => {
    const [visitsForTrail, setVisitsForTrail] = useState([]);
    const router = useNavigate();

    useEffect(() => {
        let visitsForTrail = visits.filter((visit) => visit.trail_id === trail.id);
        setVisitsForTrail(visitsForTrail);
    }, [visits, trail]);

    

    return (
        <Card className="mb-3 card-custom" onClick={() => router(`/details/${trail.id}`)} style={{ cursor: 'pointer' }}>
            <Row noGutters>
                <Col md={4}>
                    
                        <Card.Img src={trail.image_url|| "https://via.placeholder.com/400"} alt={trail.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{trail.name}</Card.Title>
                        <Card.Text>
                            <strong>Distance Away:</strong> {trail.distanceAway ? trail.distanceAway.toFixed(2) + ' miles' : 'N/A'}
                        </Card.Text>
                        <Card.Text>
                            <strong>Difficulty:</strong> {trail.difficulty}
                        </Card.Text>
                        <Card.Text>
                            <strong>Length:</strong> {trail.length} miles
                        </Card.Text>
                        <Card.Text>
                            <strong>Rating:</strong> {trail.rating} stars
                        </Card.Text>
                        <Card.Text>
                            <strong>Visits:</strong> {visitsForTrail && visitsForTrail.length ? visitsForTrail.length : 0}
                        </Card.Text>
                        <Card.Text>
                            <strong>Upvotes:</strong> {trail.upvotes}
                        </Card.Text>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default TrailCard;
