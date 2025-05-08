import React, { useState, useEffect } from "react";
import axios from "axios";
import { List } from "../components/index";

export default function ProjectDisplay() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/listings');
                setProjects(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setLoading(false);
            }
        };
        
        fetchProjects();
    }, []);
    
    if (loading) {
        return (
            <>
                <h1>Loading...</h1>
            </>
        );
    }
    
    return (
    <>
        <div className="min-h-screen w-full bg-gradient-to-r from-white via-pink-100 via-violet-100 to-white">
              <List projects={projects} />
        </div>
    </>
    );
}