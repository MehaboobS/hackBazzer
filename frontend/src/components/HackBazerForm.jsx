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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ProjectForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    github: '',
    demo: '',
    price: '',
    category: '',
    image: null,
    createdBy: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post('/api/listings/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Project published to HackBazzer!');
      navigate('/market');
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? 'Please sign in before publishing a project.'
          : err.response?.data?.message || 'Failed to submit project.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
          disabled={submitting}
          className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Project'}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
