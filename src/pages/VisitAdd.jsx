import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { supabase } from '../client';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';

const VisitAdd = () => {
    const { id } = useParams();
    const router = useNavigate();

    const [visit, setVisit] = useState({
        name: '',
        date: '',
        comment: ''
    });

    const handleChange = (e) => {
        setVisit({ ...visit, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.from('Visits').insert({
            trail_id: id,
            name: visit.name,
            date: visit.date,
            comment: visit.comment
        });
        if (error) {
            console.error('Error creating visit: ', error.message);
        } else {
            router(`/details/${id}`);
        }
    };

    return (
        <Container className="my-4">
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <h1>Add Visit</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formVisitName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={visit.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formVisitDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={visit.date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formVisitComment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="comment"
                                value={visit.comment}
                                onChange={handleChange}
                                rows={3}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default VisitAdd;
