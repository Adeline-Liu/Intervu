import React from "react";
import { useState } from "react";

// VERY IMPORTANT NOTE: This component is not properly implemented, it is just placeholder. Implement when backend is ready
function JobDescriptionSelected({ selectedJob }) {
  // Delete this when backend is fully implemented, this is purely for demonstration and testing purposes
  const mockJob = {
    title: "Botato Developer",
    company: "Botato Inc.",
    description:
      "I like botatoes. Botatoes are very nice. If are also a botato fan, you should get yourself a botato. You shouldn't get yourself only 1 botato, you should get many more botatoes. Botatoes are going to be the only way you can get this position so you better own a botato. Make sure you bring enough botatoes for the whole team to have. We take botatoes very seriously and if you do not bring a botato then you will be botatoed",
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text, maxLength = 200) => {
    if (text.length > maxLength && !isExpanded) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  if (!selectedJob) {
    return (
      <div>
        <h2 className="text-4xl text-white py-[20px] font-bold">
          Selected Job Description
        </h2>
        <div className="px-[50px] py-[30px] bg-beige text-white rounded-md my-[10px]">
          <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
            <u>Title</u>: {mockJob.title}
          </h3>
          <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
            <u>Company</u>: {mockJob.company}
          </h3>
          <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
            <u>Job Description</u>:
          </h3>
          <p className="text-darkBlue font-semibold text-xl mt-[20px]">
            {truncateText(mockJob.description)}
          </p>
          {mockJob.description.length > 100 && (
            <button
              className="text-darkBlue mt-2 underline"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
      // NOTE: Delte all code above, up to return, when backend is completed. Uncomment the code below when backend is completed
      // <div>
      //   <h2 className="text-4xl text-white py-[20px] font-bold">Selected Job Description</h2>
      //   <div className = "px-[50px] py-[30px] bg-beige text-white rounded-md my-[10px]">
      //     <h3 className="text-darkBlue font-bold text-2xl my-[20px]"><u>Title</u>: <span style = {{color: "red"}}>No Job Description Selected</span></h3>
      //     <h3 className="text-darkBlue font-bold text-2xl my-[20px]"><u>Company</u>: <span style = {{color: "red"}}>No Job Description Selected</span></h3>
      //     <h3 className="text-darkBlue font-bold text-2xl my-[20px]"><u>Job Description</u>:</h3>
      //     <p className="font-semibold text-xl my-[20px]" style = {{color: "red"}}>No job description selected</p>
      //   </div>
      // </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl text-white py-[20px] font-bold">
        Selected Job Description
      </h2>
      <div className="px-[50px] py-[30px] bg-beige text-white rounded-md my-[10px]">
        <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
          <u>Title</u>: {selectedJob.title}
        </h3>
        <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
          <u>Company</u>: {selectedJob.company}
        </h3>
        <h3 className="text-darkBlue font-bold text-2xl my-[20px]">
          <u>Job Description</u>:
        </h3>
        <p className="text-darkBlue font-semibold text-xl my-[20px]">
          {truncateText(selectedJob.description)}
        </p>
        {selectedJob.description.length > 100 && (
          <button
            className="text-darkBlue mt-2 underline"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default JobDescriptionSelected;
