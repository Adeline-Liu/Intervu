import React from "react";
import { useState } from "react";

function JobDescriptionSearcher({ setSelectedJob }) {
  const [searchResults, setSearchResults] = useState([]);

//   This is a temporary variable to demonstrate styling, remove when backend is ready
  const mockJob = {
    title: "Botato Developer",
    company: "Botato Inc.",
    description:
      "I like botatoes. Botatoes are very nice. If are also a botato fan, you should get yourself a botato. You shouldn't get yourself only 1 botato, you should get many more botatoes. Botatoes are going to be the only way you can get this position so you better own a botato. Make sure you bring enough botatoes for the whole team to have. We take botatoes very seriously and if you do not bring a botato then you will be botatoed",
  };

  const handleSearch = async (query) => {
    const response = await fetch(`/search?query=${query}`); // Replace with your backend endpoint
    const results = await response.json();
    setSearchResults(results);
  };

  return (
    <div role="region" aria-labelledby="SearchJobDescription">
      <div className = "mb-[20px]">
        <h2 id="SearchJobDescription"className="text-4xl text-darkBlue py-[20px] font-bold">
          Search for a Job Description
        </h2>
        <input
          type="search"
          placeholder="Search for a job description"
          className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
          onChange={(e) => handleSearch(e.target.value)}
          role="search"
        />
      </div>
      {/* This code is to demonstrate what an item may look like. Remove when backend is ready */}
      <ul role="list">
        <JobItem job={mockJob} setSelectedJob={setSelectedJob} />
        <JobItem job={mockJob} setSelectedJob={setSelectedJob} />
      </ul>
      <div className="p-[20px] rounded-[15px]">
        <ul>
          {searchResults.map((job, index) => (
            <JobItem key={index} job={job} setSelectedJob={setSelectedJob} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function JobItem({ job, setSelectedJob }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text, maxLength = 200) => {
    if (text.length > maxLength && !isExpanded) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <li
      onClick={() => setSelectedJob(job)}
      className="bg-darkBlue text-white px-[50px] py-[30px] rounded-md my-[10px] transition-colors border-l-[10px] border-transparent hover:border-darkGolden relative"
      style={{
        transition: "border-left 0.3s ease",
      }}
      role="listitem"
    >
      <h3 className="text-3xl mb-[10px] font-semibold">
        {job.title} - {job.company}
      </h3>
      <div className="w-35 border-b-5 border-darkGolden"></div>
      <p className="text-xl mt-[20px]">
        {truncateText(job.description)}
      </p>
      {job.description.length > 100 && (
        <button
          className="text-beige mt-2 underline"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          role="button"
          aria-label={`${job.title} from ${job.company} to show mroe or less text`}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </li>
  );
}

export default JobDescriptionSearcher;
