import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../client";

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

  useEffect(() => {
    const fetchTrail = async () => {
      const { data, error } = await supabase
        .from("Trails")
        .select("*")
        .eq("id", id);
      if (error) {
        console.error("Error fetching trail: ", error.message);
      } else {
        setTrail({
            name: data[0].name,
            description: data[0].description,
            length: data[0].length,
            difficulty: data[0].difficulty,
            rating: data[0].rating,
            image_url: data[0].image_url,
            });
        }
    };
    fetchTrail();
  }, [id]);

  const handleEditTrail = async (e) => {
    e.preventDefault();

    // i need to upload the image to my supabase storage
    const image = e.target.image.files[0];
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `trail-${Date.now()}.${fileExt}`; // Ensure a unique filename based on the timestamp
      const filePath = `${fileName}`; // Updated filePath

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Trail Images")
        .upload(filePath, image);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      // Manually construct the public URL
      const publicURL = `https://qquddfzyzzxocsqqlgur.supabase.co/storage/v1/object/public/Trail Images/${filePath}`;
      const encodedPublicURL = encodeURI(publicURL);

      const { data, error } = await supabase
        .from("Trails")
        .update({
          name: e.target.name.value,
          difficulty: e.target.difficulty.value,
          length: e.target.length.value,
          rating: e.target.rating.value,
          description: e.target.description.value,
          image_url: encodedPublicURL,
        })
        .eq("id", id);
      if (error) {
        console.error("Error updating trail: ", error.message);
      } else {
        router("/");
      }
    }
};

    const deleteTrail = async (event) => {
      event.preventDefault();
      if (!confirm("Are you sure you want to delete this trail?")) {
        return;
      }
      const { data, error } = await supabase
        .from("Trails")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Error deleting trail: ", error.message);
      } else {
        router("/");
      }
    };

    return (
      <div className="edit">
        <h1>Edit Trail</h1>
        <form onSubmit={handleEditTrail}>
          <input type="text" name="name" defaultValue={trail.name} />
          <input
            type="text"
            name="difficulty"
            defaultValue={trail.difficulty}
          />
          <input
            type="text"
            name="description"
            defaultValue={trail.description}
          />
          <input type="text" name="length" defaultValue={trail.length} />
          <input type="text" name="rating" defaultValue={trail.rating} />
          {/* image field */}
          <input type="file" name="image" />
          <button type="submit">Change</button>
        </form>
        <button onClick={() => router(`/details/${id}`)}>Back</button>
        <button onClick={deleteTrail}>Delete Trail</button>
      </div>
    );  
};


export default TrailEdit;
