import React, { useState } from "react";
import JobDescriptionSearcher from "./JobDescriptionSearcher";
import JobDescriptionCreator from "./JobDescriptionCreator";

function JobDescriptionSelector({
    setSelectedJob,
    textColor = "black",
}) {
  const [selectedJob, updateSelectedJob] = useState(null);

  return (
    <div className = "mb-[30px]">
      <JobDescriptionSearcher setSelectedJob={updateSelectedJob}/>
      <JobDescriptionCreator setSelectedJob={setSelectedJob} textColor = {textColor}/>
    </div>
  );
}

export default JobDescriptionSelector;
