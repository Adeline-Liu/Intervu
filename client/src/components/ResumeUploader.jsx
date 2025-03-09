import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

// Function to generate a random user ID
const getOrCreateUserId = () => {
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = Math.floor(Math.random() * 100).toString(); // Generate a random number
    localStorage.setItem("user_id", userId);
  }
  return userId;
};

function ResumeUploader({
  onUploadComplete,
  bgColor = "white",
  bgColorHover = "grey",
  textColor = "black",
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const userId = getOrCreateUserId(); // Get user ID
  //   const [fileUrl, setfileUrl] = useState(localStorage.getItem("fileUrl")); // ✅ Restore file URL after refresh

  console.log("User ID:", userId);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  //   useEffect(() => {
  //     if (resumeUrl) {
  //       onUploadComplete(resumeUrl); //  Restore preview after refresh
  //     }
  //   }, [resumeUrl, onUploadComplete]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    const fileUrl = URL.createObjectURL(file);
    onUploadComplete(fileUrl);

    try {
      const formData = new FormData();

      formData.append("file", file); // Add file to form-data

      // Send file to backend
      const response = await axios.post(
        `http://54.81.170.161:8000/upload_resume/${userId}`, // Dynamic user_id
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploading(false);
      alert("Resume uploaded successfully!");
      onUploadComplete(response.data.fileUrl); // Use correct response key
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload resume.");
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: "20px",
        }}
      >
        {/* Upload Button */}
        <button
          className="text-center text-2xl font-semibold px-[32px] py-[20px] rounded-md transition-colors duration-300"
          onClick={handleButtonClick}
          style={{
            backgroundColor: bgColor,
            color: textColor,
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = bgColorHover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = bgColor;
          }}
          role="button"
          aria-label="Upload Resume"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>

        {/* Show uploaded file name */}
        {fileName && (
          <span
            style={{
              marginLeft: "20px",
              fontWeight: "600",
              textDecorationLine: "underline",
              color: "darkBlue",
              fontSize: 20,
            }}
          >
            {fileName}
          </span>
        )}

        {/* Hidden input field for file selection */}
        <input
          type="file"
          id="fileUpload"
          ref={fileInputRef}
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label htmlFor="fileUpload" style={{ display: "none" }}>
          Upload PDF
        </label>
      </div>
      <div>
        <p style={{ color: "grey", fontWeight: "600", fontSize: 20 }}>
          Supported file types: PDF
        </p>
      </div>
    </div>
  );
}

export default ResumeUploader;
