import { useState } from 'react';
import {Card} from "./index"
// Card component to display individual project information
const List = ({ projects }) => {
    const [filter, setFilter] = useState('All');
    
    const filteredProjects = filter === 'All' 
      ? projects 
      : projects.filter(project => project.category === filter);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            {['All', 'Software', 'Hardware', 'Miscellaneous'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${
                  category === 'All' ? 'rounded-l-lg' : ''
                } ${
                  category === 'Miscellaneous' ? 'rounded-r-lg' : ''
                } border border-gray-200`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card key={project._id} project={project} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              No projects found in this category.
            </div>
          )}
        </div>
      </div>
    );
  };

export default List