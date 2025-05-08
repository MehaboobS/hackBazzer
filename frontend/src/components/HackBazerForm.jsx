// import { useState, useRef } from 'react';
// import axios from 'axios';
// export default function ProjectForm() {
//  const [image,setImage]=useState(null)
//   const handleSubmit=async(evt)=>{
//     evt.preventDefault();
//     const formData = new FormData();
//     formData.append('image', image);

//     try {
//       const response = await axios.post('/api/listings/create', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       }catch(err){
//         console.log(err)
//       }
//   }
//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Your Project</h2>
//       <form onSubmit={(e)=>handleSubmit(e)}>
//         <input type="file" name='image' onChange={(e)=>setImage(e.target.files[0])}/>
//         <br /><br />
//         <button>submit</button>
//       </form>
      
//     </div>
//   );
// }

import React, { useState } from 'react';
import axios from 'axios';

function ProjectForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    github: '',
    demo: '',
    price: '',
    category: '',
    image: null,
    createdBy: '', // Replace this with a real user ID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('/api/listings/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Project uploaded:', response.data);
      alert('Project submitted successfully!');
    } catch (err) {
      console.error('Error uploading project:', err);
      alert('Failed to submit project.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Submit a Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <input
          type="url"
          name="github"
          placeholder="GitHub Link"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <input
          type="url"
          name="demo"
          placeholder="Demo Link (optional)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <select
          name="category"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Software">Software</option>
          <option value="Hardware">Hardware</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
       
        <input
          type="file"
          name="image"
          className="w-full"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
