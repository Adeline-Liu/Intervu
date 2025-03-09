// import React, { useState } from "react";

// function JobDescriptionSelected({ selectedJob }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const safeJob = selectedJob || { title: "", company: "", description: "" };

//   const truncateText = (text, maxLength = 200) => {
//     if (!text || typeof text !== "string") return "";
//     return text.length > maxLength && !isExpanded
//       ? text.slice(0, maxLength) + "..."
//       : text;
//   };

//   if (!selectedJob) {
//     return (
//       <div role="region" aria-labelledby="SelectedJobDescription">
//         <h2
//           id="SelectedJobDescription"
//           className="text-4xl text-white py-[20px] font-bold"
//         >
//           Selected Job Description
//         </h2>
//         <div className="px-[50px] py-[30px] bg-beige text-white rounded-md my-[10px]">
//           <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
//             Title:{" "}
//             <span style={{ color: "red" }}>No Job Description Selected</span>
//           </h3>
//           <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
//             Company:{" "}
//             <span style={{ color: "red" }}>No Job Description Selected</span>
//           </h3>
//           <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
//             Job Description:
//           </h3>
//           <p
//             className="font-semibold text-xl my-[20px]"
//             style={{ color: "red" }}
//           >
//             No job description selected
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="text-4xl text-white py-[20px] font-bold">
//         Selected Job Description
//       </h2>
//       <div className="px-[50px] py-[30px] bg-beige text-white rounded-md my-[10px]">
//         <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
//           <u>Title</u>: {selectedJob.title}
//         </h3>
//         <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
//           <u>Company</u>: {selectedJob.company}
//         </h3>
//         <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
//           <u>Job Description</u>:
//         </h3>
//         <p className="text-darkBlue font-semibold text-xl my-[20px] break-words">
//           {truncateText(selectedJob.description)}
//         </p>
//         {selectedJob.description.length > 100 && (
//           <button
//             className="text-darkBlue mt-2 underline"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsExpanded(!isExpanded);
//             }}
//             role="button"
//           >
//             {isExpanded ? "Show less" : "Show more"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default JobDescriptionSelected;

import React, { useState, useEffect } from "react";

function JobDescriptionSelected({ selectedJob }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [safeJob, setSafeJob] = useState({
    job_title: "",
    job_company: "",
    job_description: "",
  });

  //   // Ensure `safeJob` updates correctly when `selectedJob` changes
  //   useEffect(() => {
  //     if (selectedJob && selectedJob.title) {
  //       setSafeJob(selectedJob); // Correctly updates safeJob
  //     }
  //   }, [selectedJob]);

  useEffect(() => {
    console.log("🔄 Updating selected job:", selectedJob); // ✅ Debugging: See if selectedJob updates
    if (selectedJob && selectedJob.job_title) {
      setSafeJob(selectedJob);
    }
  }, [selectedJob]);

  // ✅ Safe truncate function to prevent `.length` errors
  const truncateText = (text, maxLength = 200) => {
    if (!text || typeof text !== "string") return ""; // Prevents `.length` error
    return text.length > maxLength && !isExpanded
      ? text.slice(0, maxLength) + "..."
      : text;
  };

  return (
    <div>
      <h2 className="text-4xl text-white py-[20px] font-bold">
        Selected Job Description
      </h2>
      <div className="px-[50px] py-[30px] bg-beige text-white rounded-md my-[10px]">
        <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
          <u>Title</u>: {safeJob.job_title || "No Job Selected"}
        </h3>
        <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
          <u>Company</u>: {safeJob.job_company || "No company Selected"}
        </h3>
        <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
          <u>Job Description</u>:
        </h3>
        <p className="text-darkBlue font-semibold text-xl my-[20px] break-words">
          {truncateText(safeJob.job_description)}
        </p>
        {safeJob.description && safeJob.description.length > 100 && (
          <button
            className="text-darkBlue mt-2 underline"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            role="button"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default JobDescriptionSelected;
