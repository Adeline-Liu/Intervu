// import React from "react";
// import { useState } from "react";

// function JobDescriptionSearcher({ setSelectedJob }) {
//   const [searchResults, setSearchResults] = useState([]);

//   //   This is a temporary variable to demonstrate styling, remove when backend is ready
//   const mockJob = {
//     title: "Botato Developer",
//     company: "Botato Inc.",
//     description:
//       "I like botatoes. Botatoes are very nice. If are also a botato fan, you should get yourself a botato. You shouldn't get yourself only 1 botato, you should get many more botatoes. Botatoes are going to be the only way you can get this position so you better own a botato. Make sure you bring enough botatoes for the whole team to have. We take botatoes very seriously and if you do not bring a botato then you will be botatoed",
//   };

//   const handleSearch = async (query) => {
//     const response = await fetch(`/search?query=${query}`); // Replace with your backend endpoint
//     const results = await response.json();
//     setSearchResults(results);
//   };

//   return (
//     <div role="region" aria-labelledby="SearchJobDescription">
//       <div className="mb-[20px] ">
//         <h2
//           id="SearchJobDescription"
//           className="text-4xl text-darkBlue py-[20px] font-bold"
//         >
//           Search for a Job Description
//         </h2>
//         <div className="flex items-center justify-center justify-center">
//           <input
//             type="search"
//             placeholder="Search for a job description"
//             className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
//             onChange={(e) => handleSearch(e.target.value)}
//             role="search"
//           />
//           <button className="px-4 py-2 bg-brown text-xl text-white font-semibold rounded-md transition-colors duration-300 hover:bg-[#3b2e23] ml-3 ">
//             Search
//           </button>
//         </div>
//       </div>

//       {/* This code is to demonstrate what an item may look like. Remove when backend is ready */}
//       <ul role="list">
//         <JobItem job={mockJob} setSelectedJob={setSelectedJob} />
//         <JobItem job={mockJob} setSelectedJob={setSelectedJob} />
//         <JobItem job={mockJob} setSelectedJob={setSelectedJob} />
//       </ul>
//       <div className="p-[20px] rounded-[15px]">
//         <ul>
//           {searchResults.map((job, index) => (
//             <JobItem key={index} job={job} setSelectedJob={setSelectedJob} />
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// function JobItem({ job, setSelectedJob }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const truncateText = (text, maxLength = 200) => {
//     if (text.length > maxLength && !isExpanded) {
//       return text.slice(0, maxLength) + "...";
//     }
//     return text;
//   };

//   return (
//     <li
//       onClick={() => setSelectedJob(job)}
//       className="bg-darkBlue text-white px-[50px] py-[30px] rounded-md my-[10px] transition-colors border-l-[10px] border-transparent hover:border-darkGolden relative"
//       style={{
//         transition: "border-left 0.3s ease",
//       }}
//       role="listitem"
//     >
//       <h3 className="text-3xl mb-[10px] font-semibold">
//         {job.title} - {job.company}
//       </h3>
//       <div className="w-35 border-b-5 border-darkGolden"></div>
//       <p className="text-xl mt-[20px]">{truncateText(job.description)}</p>
//       {job.description.length > 100 && (
//         <button
//           className="text-beige mt-2 underline"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsExpanded(!isExpanded);
//           }}
//           role="button"
//           aria-label={`${job.title} from ${job.company} to show mroe or less text`}
//         >
//           {isExpanded ? "Show less" : "Show more"}
//         </button>
//       )}
//     </li>
//   );
// }

// export default JobDescriptionSearcher;

// import React, { useState } from "react";

// function JobDescriptionSearcher({ setSelectedJob }) {
//   const [searchQuery, setSearchQuery] = useState(""); // Store input value
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState(""); // Add error state

//   // Temporary mock job data (for styling/demo)
//   const mockJob = {
//     title: "Botato Developer",
//     company: "Botato Inc.",
//     description:
//       "I like botatoes. Botatoes are very nice. If you are also a botato fan, you should get yourself a botato. You shouldn't get yourself only 1 botato, you should get many more botatoes. Botatoes are going to be the only way you can get this position so you better own a botato. Make sure you bring enough botatoes for the whole team to have. We take botatoes very seriously and if you do not bring a botato then you will be botatoed.",
//   };

//   // Function to handle search when button is clicked
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       setError("Please enter a search term.");
//       setSearchResults([]);
//       return;
//     }

//     setError(""); // Clear previous errors

//     try {
//       // Call backend API
//       const response = await fetch(
//         `http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }

//       const data = await response.json(); // Parse JSON response

//       if (!Array.isArray(data)) {
//         throw new Error("Unexpected response format: Expected an array.");
//       }

//       const limitedResults = data.length > 0 ? data.slice(0, 3) : [];

//       setSearchResults(limitedResults);
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div role="region" aria-labelledby="SearchJobDescription">
//       <div className="mb-[20px]">
//         <h2
//           id="SearchJobDescription"
//           className="text-4xl text-darkBlue py-[20px] font-bold"
//         >
//           Search for a Job Description
//         </h2>

//         {/* Search bar & button */}
//         <div className="flex items-center justify-center space-x-3">
//           <input
//             type="text"
//             placeholder="Search for a job description"
//             className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button
//             onClick={handleSearch}
//             className="px-4 py-2 bg-brown text-xl text-white font-semibold rounded-md transition-colors duration-300 hover:bg-[#3b2e23]"
//           >
//             Search
//           </button>
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-red-500">{error}</p>}
//       </div>

//       {/* Display only the first 3 results */}
//       <ul role="list">
//         {searchResults.length > 0 ? (
//           searchResults.map((job, index) => (
//             <JobItem key={index} job={job} setSelectedJob={setSelectedJob} />
//           ))
//         ) : (
//           <div className="flex justify-center">
//             <p className="text-darkBlue text-2xl mb-5 font-bold">
//               No results found.
//             </p>
//           </div>
//         )}
//       </ul>
//     </div>
//   );
// }

// function JobItem({ job, setSelectedJob }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const truncateText = (text, maxLength = 200) => {
//     return text.length > maxLength && !isExpanded
//       ? text.slice(0, maxLength) + "..."
//       : text;
//   };

//   return (
//     <li
//       onClick={() => setSelectedJob(job)}
//       className="bg-darkBlue text-white px-[50px] py-[30px] rounded-md my-[10px] transition-colors border-l-[10px] border-transparent hover:border-darkGolden relative"
//       role="listitem"
//     >
//       <h3 className="text-3xl mb-[10px] font-semibold">
//         {job.title} - {job.company}
//       </h3>
//       <div className="w-35 border-b-5 border-darkGolden"></div>
//       <p className="text-xl mt-[20px]">{truncateText(job.description)}</p>
//       {job.description.length > 100 && (
//         <button
//           className="text-beige mt-2 underline"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsExpanded(!isExpanded);
//           }}
//         >
//           {isExpanded ? "Show less" : "Show more"}
//         </button>
//       )}
//     </li>
//   );
// }

// export default JobDescriptionSearcher;import React, { useState } from "react";

import React, { useState } from "react";

function JobDescriptionSearcher({ setSelectedJob }) {
  const [searchQuery, setSearchQuery] = useState(""); // Store input value
  const [searchResults, setSearchResults] = useState([]); // Store job results
  const [error, setError] = useState(""); // Handle errors

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term.");
      setSearchResults([]);
      return;
    }

    setError(""); // Clear previous errors

    try {
      const response = await fetch(
        `http://54.81.170.161:8000/get_jobs?query=${encodeURIComponent(
          searchQuery
        )}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data, status: ${response.status}`);
      }

      const data = await response.json(); // ✅ Parse JSON response

      if (!data.jobs || !Array.isArray(data.jobs)) {
        throw new Error(
          "Unexpected response format: Expected an array of jobs."
        );
      }

      // ✅ Extract first 3 job results only
      const limitedResults = data.jobs.slice(0, 3);
      setSearchResults(limitedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div role="region" aria-labelledby="SearchJobDescription">
      <div className="mb-[20px]">
        <h2
          id="SearchJobDescription"
          className="text-4xl text-darkBlue py-[20px] font-bold"
        >
          Search for a Job Description
        </h2>

        {/* Search bar & button */}
        <div className="flex items-center justify-center space-x-3">
          <input
            type="text"
            placeholder="Search for a job description"
            className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-brown text-xl text-white font-semibold rounded-md transition-colors duration-300 hover:bg-[#3b2e23]"
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 font-bold">{error}</p>}
      </div>

      {/* Display only the first 3 results */}
      <ul role="list">
        {searchResults.length > 0 ? (
          searchResults.map((job, index) => (
            <JobItem key={index} job={job} setSelectedJob={setSelectedJob} />
          ))
        ) : (
          <div className="flex justify-center">
            <p className="text-darkBlue text-2xl mb-5 font-bold">
              No results found.
            </p>
          </div>
        )}
      </ul>
    </div>
  );
}

function JobItem({ job, setSelectedJob }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text, maxLength = 200) => {
    return text.length > maxLength && !isExpanded
      ? text.slice(0, maxLength) + "..."
      : text;
  };

  return (
    <li
      onClick={() => setSelectedJob(job)}
      className="bg-darkBlue text-white px-[50px] py-[30px] rounded-md my-[10px] transition-colors border-l-[10px] border-transparent hover:border-darkGolden relative"
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
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </li>
  );
}

export default JobDescriptionSearcher;
