import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card } from "./index";

const CATEGORY_TABS = ["All", "Software", "Hardware", "Miscellaneous"];

const List = ({ projects }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category");
  const [filter, setFilter] = useState(
    CATEGORY_TABS.includes(initialCat) ? initialCat : "All"
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const paramCat = searchParams.get("category");
    if (paramCat && CATEGORY_TABS.includes(paramCat)) {
      setFilter(paramCat);
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setFilter(category);
    if (category === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const query = search.trim().toLowerCase();
  const filteredProjects = projects
    .filter((project) => {
      const matchesCategory = filter === "All" || project.category === filter;
      const matchesQuery =
        !query ||
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Project Marketplace
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-500 sm:w-64"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-500"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORY_TABS.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryChange(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === category
                ? "bg-purple-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-700 hover:border-purple-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project._id} project={project} />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-gray-500">
            No matching projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
