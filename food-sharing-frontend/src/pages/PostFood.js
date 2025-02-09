import React, { useState } from "react";
import axios from "axios";

const PostFood = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("image", image);

    try {
      await axios.post("http://127.0.0.1:5000/food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Food listed successfully!");
    } catch (error) {
      alert("Error posting food!");
    }
  };

  return (
    <div>
      <h2>Post Food</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder="Location" onChange={(e) => setLocation(e.target.value)} required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit">Post Food</button>
      </form>
    </div>
  );
};

export default PostFood;
