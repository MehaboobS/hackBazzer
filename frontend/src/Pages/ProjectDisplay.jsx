import React, { useState, useEffect } from "react";
import axios from "axios";
import { List } from "../components/index";

export default function ProjectDisplay() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/listings");
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-white via-pink-50 to-purple-50">
      <List projects={projects} />
    </div>
  );
}
