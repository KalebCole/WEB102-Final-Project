import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const TrailCard = ({ trail, userLocation }) => {
    const router = useNavigate();

    return (
        <Card className="mb-3" onClick={() => router(`/details/${trail.id}`)} style={{ cursor: 'pointer' }}>
            <Row noGutters>
                <Col md={4}>
                    <Card.Img src={trail.image_url} alt={trail.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{trail.name}</Card.Title>
                        <Card.Text>
                            <strong>Location:</strong> {trail.location.city}
                        </Card.Text>
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
                            <strong>Visits:</strong> {trail.visits}
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
