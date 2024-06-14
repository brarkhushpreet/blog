"use client"
import React, { useState } from 'react';
import axios from 'axios'; // Import axios

const initialState = {
  title: '',
  desc: '',
  slug: '',
  img:'/download.jpg',
  userId: '',
};

const ServerActionTestPage = () => {
  const [formData, setFormData] = useState(initialState);
  const [postId, setPostId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
   
  };

  const handleDeleteChange = (e) => {
    setPostId(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(`http://localhost:3000/api/blog/${postId}`);
      console.log('Delete request successful', response.data);
      setPostId('');
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
        console.log(formData)
      const response = await axios.post('http://localhost:3000/api/addPost', JSON.stringify(formData));
      console.log('Post request successful', response.data);
      
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          onChange={handleChange}
        />

        <label htmlFor="desc">Description:</label>
        <input
          id="desc"
          type="text"
          name="desc"
          onChange={handleChange}
        ></input>

        <label htmlFor="slug">Slug:</label>
        <input
          type="text"
          id="slug"
          name="slug"
          
          onChange={handleChange}
        />

        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          name="userId"
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      <form onSubmit={handleDelete}>
        <label htmlFor="postId">Post ID:</label>
        <input
          type="text"
          id="postId"
          name="postId"
          onChange={handleDeleteChange}
        />
        <button type="submit">Delete post by ID</button>
      </form>
    </div>
  );
};

export default ServerActionTestPage;
