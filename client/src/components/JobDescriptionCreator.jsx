import React, { useState } from "react";
import axios from "axios";

const generateJobId = () => {
  return `job_${Math.floor(Math.random() * 100).toString()}`;
};

function JobDescriptionCreator({ setSelectedJob, textColor = "black" }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !company.trim() || !description.trim()) {
      return;
    }

    const jobId = generateJobId();
    const formData = new FormData();
    formData.append("job_title", jobTitle);
    formData.append("job_company", company);
    formData.append("job_description", description);

    console.log("Creating job with ID:", jobId);
    console.log("Job Title:", jobTitle);
    console.log("Company:", company);
    console.log("Description:", description);

    try {
      await axios.post(
        `http://54.81.170.161:8000/upload_posting/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Pass the created job to the parent component
      setSelectedJob({
        job_title: jobTitle,
        job_company: company,
        job_description: description,
      });

      // Reset form fields after success
      setTimeout(() => {
        setJobTitle("");
        setCompany("");
        setDescription("");
      }, 100); // Small delay to avoid brief `undefined` state
    } catch (error) {
      console.error("❌ Error uploading job posting:", error);
    }
  };

  return (
    <div
      className="px-[50px] py-[30px] bg-beige rounded-[15px]"
      role="region"
      aria-labelledby="CreateJobDescription"
    >
      <h2
        id="CreateJobDescription"
        className="text-4xl text-darkBlue py-[20px] font-bold"
      >
        Create Job Description
      </h2>
      <form onSubmit={handleCreateJob} role="form">
        <input
          type="text"
          id="jobTitle"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
          required
        />
        <label
          htmlFor="jobTitle"
          className="sr-only"
          style={{ display: "none" }}
        >
          Job Title
        </label>
        <input
          type="text"
          id="company"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
          required
        />
        <label
          htmlFor="company"
          className="sr-only"
          style={{ display: "none" }}
        >
          Company
        </label>
        <textarea
          placeholder="Job Description"
          id="jobDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
          required
        ></textarea>
        <label
          htmlFor="jobDescription"
          className="sr-only"
          style={{ display: "none" }}
        >
          Job Description
        </label>
        <div className="w-full flex justify-center mt-[20px]">
          <button
            type="submit"
            className="text-center text-2xl font-semibold px-[32px] py-[20px] rounded-md transition-colors duration-300"
            style={{
              backgroundColor: "var(--color-brown)",
              color: "white",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#3b2e23";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--color-brown)";
            }}
            role="button"
          >
            Create Job Description
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobDescriptionCreator;
