import React, { useRef, useState } from "react";
import axios from "axios"; // NOTE: remove or comment this line when AWS amplify is implemented
// import { Storage } from 'aws-amplify'; NOTE: uncomment this line when AWS amplify is implemented

function ResumeUploader({
  onUploadComplete,
  bgColor = "white",
  bgColorHover = "grey",
  textColor = "black",
}) {
  const fileInputRef = useRef(null); // Reference to the hidden input
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Open the file dialog when the button is clicked
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFileName("");

    try {
      // Get pre-signed URL from the backend
      const { data } = await axios.get("/api/upload-url", {
        params: { fileName: file.name, fileType: file.type },
      });

      // Upload the file to S3
      await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      // Upload the file directly to S3 using Amplify Storage
      //   const result = await Storage.put(file.name, file, {
      //     contentType: file.type,
      //   });
      // NOTE: uncomment these lines and remove all lines, up to try, when AWS amplify is implemented

      setUploading(false);
      setFileName(file.name);
      alert("File uploaded successfully!");
      onUploadComplete(data.fileKey); // Pass fileKey for later use
    } catch (error) {
      console.error("Error uploading file:", error);
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
        {/* Button to trigger file input */}
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
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
        {/* Display the uploaded file name */}
        {fileName && (
          <span
            style={{
              marginLeft: "20px",
              fontWeight: "600",
              textDecorationLine: "underline",
              color: "blue",
              fontSize: 20,
            }}
          >
            {fileName}
          </span>
        )}

        {/* Hidden input field for file selection */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
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
