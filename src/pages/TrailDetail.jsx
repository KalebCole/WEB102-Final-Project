import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { supabase } from "../client";
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const TrailDetail = () => {
    const { id } = useParams();
    const router = useNavigate();
    const [trail, setTrail] = useState({});
    const [visits, setVisits] = useState([]);

    const increaseUpvotes = async () => {
        const newUpvotes = trail.upvotes + 1;
        setTrail({ ...trail, upvotes: newUpvotes });
        const { data, error } = await supabase.from('Trails').update({ upvotes: newUpvotes }).eq('id', id);
        if (error) {
            console.error('Error updating upvotes: ', error.message);
        }
    };

    useEffect(() => {
        const fetchTrail = async () => {
            const { data, error } = await supabase.from('Trails').select('*').eq('id', id);
            if (error) {
                console.error('Error fetching trail: ', error.message);
            } else {
                setTrail(data[0]);
            }
        };

        const fetchVisits = async () => {
            const { data, error } = await supabase.from('Visits').select('*').eq('trail_id', id);
            if (error) {
                console.error('Error fetching visits: ', error.message);
            } else {
                setVisits(data);
            }
        };

        fetchTrail();
        fetchVisits();
    }, [id]);

    return (
        <Container className="my-4">
            <Row>
                <Col md={4}>
                    <Card className="h-100 d-flex flex-column">
                        <Card.Body>
                            <Card.Title>About</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Trail: {trail.name}</Card.Subtitle>
                            <Card.Text>Description: {trail.description || "No description available"}</Card.Text>
                            <Card.Text>Difficulty: {trail.difficulty}</Card.Text>
                            <Card.Text>Length: {trail.length} miles</Card.Text>
                            <Card.Text>Rating: {trail.rating} stars</Card.Text>
                            <Card.Text>Visits: {trail.visits}</Card.Text>
                            <Card.Text>Upvotes: {trail.upvotes}</Card.Text>
                            <Button variant="primary" onClick={increaseUpvotes} className="mr-2">Upvote 👆</Button>
                            <Button variant="warning" onClick={() => router(`/edit/${trail.id}`)}>Edit Trail</Button>
                            <Button variant="success" className="mt-2" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${trail.location.lat},${trail.location.lng}`)}>Get Directions</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="h-100">
                        <Card.Img variant="top" src={trail.image_url} alt={trail.name} style={{ height: '100%', objectFit: 'cover' }} />
                    </Card>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h2>Visits</h2>
                    <Button variant="success" onClick={() => router(`/add-visit/${trail.id}`)} className="mb-3">Add Visit</Button>
                    <ListGroup variant="flush">
                        {visits.map((visit) => (
                            <ListGroup.Item key={visit.id}>
                                <strong>{visit.name}</strong> - {new Date(visit.date).toLocaleDateString()}
                                <p>{visit.comment}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default TrailDetail;
