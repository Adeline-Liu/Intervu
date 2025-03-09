import React from "react";
import { useState } from "react";

function JobDescriptionSearcher({ setSelectedJob }) {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    const formData = new FormData();
    formData.append("query", query);

    try {
      const response = await fetch("http://54.81.170.161:8000/get_jobs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.jobs);
        setSearchPerformed(true);
      } else {
        console.error("Error fetching jobs:", response.statusText);
        setSearchResults([]);
        setSearchPerformed(true);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setSearchResults([]);
      setSearchPerformed(true);
    }
  };

  return (
    <div
      className="mb-[20px]"
      role="region"
      aria-labelledby="SearchJobDescription"
    >
      <div className="mb-[20px]">
        <h2
          id="SearchJobDescription"
          className="text-4xl text-darkBlue py-[20px] font-bold"
        >
          Search for a Job Description
        </h2>
        <div className="flex items-center justify-center space-x-3 pt-3">
          <input
            type="search"
            id="jobSearch"
            placeholder="Search for a job description"
            className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
            onChange={(e) => setQuery(e.target.value)}
            role="search"
          />
          <label htmlFor="jobSearch" className="visually-hidden hidden">
            Job Search
          </label>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-brown text-xl text-white font-semibold rounded-md transition-colors duration-300 hover:bg-[#3b2e23]"
            role="button"
            aria-label="Search for jobs"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        {searchPerformed && searchResults.length === 0 && (
          <p className="text-darkBlue text-2xl mb-5 font-bold">
            No results found
          </p>
        )}
      </div>
      <ul role="list">
        {searchResults.map((job, index) => (
          <JobItem key={index} job={job} setSelectedJob={setSelectedJob} />
        ))}
      </ul>
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
        {job.job_title} - {job.job_company}
      </h3>
      <div className="w-35 border-b-5 border-darkGolden"></div>
      <p className="text-xl mt-[20px]">{truncateText(job.job_description)}</p>
      {job.job_description.length > 100 && (
        <button
          className="text-beige mt-2 underline"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          role="button"
          aria-label={`${job.job_title} from ${job.job_company} to show more or less text`}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </li>
  );
}

export default JobDescriptionSearcher;
