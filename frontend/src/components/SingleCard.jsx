import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function SingleCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [allReviews, setAllReviews] = useState([]);
  const [user,setUser]=useState("123456789");
  const currentUser=useSelector(userData=>userData.auth.userData) // Simulated user ID
  console.log(currentUser)
  console.log(currentUser?._id)
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/api/listings/project/${id}`);
        setProject(response.data || null);
      } catch (err) {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/listings/project/${id}/allReviews`);
        if(res){
          console.log(res)
          console.log(res?.data?.reviews)
          // console.log(res.data.reviews)
        setAllReviews(res.data.reviews || []);

        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };

    fetchProject();
    fetchReviews();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/listings/project/${id}`);
      navigate("/listings");
    } catch (err) {
      setError("Failed to delete project");
    }
  };

  const handleStarClick = (starValue) => {
    setReview({ ...review, rating: starValue });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp=await axios.post(`/api/listings/project/${id}/reviews`, review);
      setReview({ rating: 0, comment: "" });
      // const updatedReviews = await axios.get(`/api/listings/project/${id}/reviews`);
      // setAllReviews(updatedReviews.data || []);
      console.log(resp)
      alert("Review submitted successfully!");
    } catch (err) {
      setError("Failed to submit review");
    }
  };

  if (loading) return <div className="text-center p-10 text-purple-700">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!project) return <div className="text-center p-10 text-purple-700">Project not found</div>;

  const isAuthor = project?.createdBy?._id === user;
  const handlePayment = async () => {
    try {
      const { data } = await axios.post('/api/create-order', {
        amount: project.price,  // Amount in INR (500 INR)
        currency: 'INR',
      });
  
      const options = {
        key: 'rzp_test_XUC874UcvpP0xs',
        amount: project.price * 100,
        currency: 'INR',
        order_id: data.orderId,
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-white via-pink-100 via-purple-100 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Project Details */}
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={project.image || "/api/placeholder/800/600"}
                alt={project.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-purple-800">{project.name}</h1>
              <p className="mt-2 text-gray-700">{project.description}</p>
              <p className="mt-2 font-semibold text-purple-600">${project.price}</p>
              <p className="text-sm text-gray-500 mt-2">
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex gap-3">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="bg-purple-600 text-white px-4 py-2 rounded">
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="bg-pink-500 text-white px-4 py-2 rounded">
                    Live Demo
                  </a>
                )}
              </div>

              {isAuthor ? (
                <div className="mt-6 flex gap-3">
                  <Link to={`/listings/edit/${project._id}`} className="bg-pink-400 text-white px-4 py-2 rounded">
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex gap-3">
                  <button className="bg-purple-500 text-white px-4 py-2 rounded">Add to Cart</button>
                  {/* <a href="https://pages.razorpay.com/pl_QQm6wAw8F2izZQ/view"> */}
                  <button  className="bg-pink-500 text-white px-4 py-2 rounded" onClick={handlePayment}>Buy Now</button>
                  {/* </a> */}
                </div>
              )}
            </div>
          </div>

          {/* Review Submission */}
          <div className="p-6 border-t border-purple-200">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Leave a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="text-3xl focus:outline-none"
                    >
                      {star <= review.rating ? (
                        <span className="text-pink-500">★</span>
                      ) : (
                        <span className="text-gray-400">☆</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Write your comment"
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                className="w-full border border-purple-300 rounded px-3 py-2 mb-4"
                rows={3}
                required
              />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
                Submit Review
              </button>
            </form>
          </div>

          {/* Display All Reviews */}
          <div className="p-6 border-t border-purple-200 bg-purple-50">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">All Reviews</h2>
            {allReviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {allReviews.map((r, index) => (
    <div key={index} className="bg-white p-4 rounded shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-purple-700">
          {r.stars} / 5
        </div>
        <div className="text-sm text-gray-500">
          {new Date(r.createdAt).toLocaleDateString()}
        </div>
      </div>
      <p className="text-gray-700">{r.comment}</p>
    </div>
  ))}
</div>

            )}
          </div>
        </div>
      </div>
    </div>
  );
}
