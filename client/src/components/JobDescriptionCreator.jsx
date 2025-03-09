import React, { useState } from "react";

function JobDescriptionCreator({ textColor = "black" }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const job = { title: jobTitle, company, description };

    // Save to the database via an API (PLACHOLDER)
    await fetch("/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    alert("Job Description Created!");
    setJobTitle("");
    setCompany("");
    setDescription("");
  };

  return (
    <div className="px-[50px] py-[30px] bg-beige rounded-[15px]">
      <h2 className="text-4xl text-darkBlue py-[20px] font-bold">
        Create Job Description
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
          required
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
          required
        ></textarea>
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
          >
            Create Job Description
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobDescriptionCreator;
