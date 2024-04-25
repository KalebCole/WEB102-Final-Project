import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../client";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

const TrailEdit = () => {
  const { id } = useParams();
  const router = useNavigate();
  const [trail, setTrail] = useState({
    name: "",
    description: "",
    length: "",
    difficulty: "",
    rating: "",
    image_url: "",
  });

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setTrail({ ...trail, image: e.target.files[0] });
    }
  };
  useEffect(() => {
    const fetchTrail = async () => {
      const { data, error } = await supabase
        .from("Trails")
        .select("*")
        .eq("id", id);
      if (error) {
        console.error("Error fetching trail: ", error.message);
      } else {
        setTrail(data[0]);
      }
    };
    fetchTrail();
  }, [id]);

  const handleEditTrail = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedTrail = {
      name: formData.get("name"),
      difficulty: formData.get("difficulty"),
      length: formData.get("length"),
      rating: formData.get("rating"),
      description: formData.get("description"),
      image_url: trail.image_url, // maintain the original image unless a new one is uploaded
    };

    // Image uploading logic only if a new image is selected
    const image = formData.get("image");
    if (image && image.size > 0) {
      const fileExt = image.name.split(".").pop();
      const fileName = `trail-${Date.now()}.${fileExt}`; // Ensure a unique filename based on the timestamp
      const filePath = `${fileName}`;

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Trail Images")
        .upload(filePath, image);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      // Manually construct the public URL
      updatedTrail.image_url = `https://qquddfzyzzxocsqqlgur.supabase.co/storage/v1/object/public/Trail Images/${filePath}`;
    }

    const { data, error } = await supabase
      .from("Trails")
      .update(updatedTrail)
      .eq("id", id);
    if (error) {
      console.error("Error updating trail: ", error.message);
    } else {
      router(`/details/${id}`);
    }
  };

  const deleteTrail = async (event) => {
    event.preventDefault();
    if (!confirm("Are you sure you want to delete this trail?")) {
      return;
    }
    const { data, error } = await supabase.from("Trails").delete().eq("id", id);
    if (error) {
      console.error("Error deleting trail: ", error.message);
    } else {
      router("/");
    }
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Edit Trail</Card.Title>
              <Form onSubmit={handleEditTrail}>
                <Form.Group controlId="formTrailName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={trail.name}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTrailDifficulty">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Control
                    type="text"
                    name="difficulty"
                    defaultValue={trail.difficulty}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTrailDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    defaultValue={trail.description}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTrailLength">
                  <Form.Label>Length (miles)</Form.Label>
                  <Form.Control
                    type="number"
                    name="length"
                    defaultValue={trail.length}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTrailRating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    defaultValue={trail.rating}
                    required
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </Form.Group>
                <Form.Group controlId="formImage">
                  <Form.Label>Image:</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                <Button variant="success" type="submit" className="mr-2">
                  Update
                </Button>
                <Button variant="danger" onClick={deleteTrail} className="mr-2">
                  Delete Trail
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router(`/details/${id}`)}
                >
                  Back to Trail
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={trail.image_url || "https://via.placeholder.com/400"}
              alt={trail.name}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrailEdit;
