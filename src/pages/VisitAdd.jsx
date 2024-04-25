import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {supabase} from '../client';

const VisitAdd = () => {
    const {id} = useParams();
    const router = useNavigate();

    const [visit, setVisit] = useState({
        name: '',
        date: null,
        comment: ''
    });

    const handleChange = (e) => {
        setVisit({...visit, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(id)
        // insert visit to supabase
        const createVisit = async () => {
            const {data, error} = await supabase.from('Visits').insert({
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
        createVisit();
    };
    
  return (
    <div>
      <h1>Add Visit</h1>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" onChange={handleChange} />
        <label htmlFor="date">Date</label>
        <input type="date" id="date" name="date" onChange={handleChange}/>
        <label htmlFor="comment">Comment</label>
        <textarea id="comment" name="comment" onChange={handleChange}></textarea>
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
};

export default VisitAdd;