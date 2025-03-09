import React, { useState, useEffect } from "react";
import axios from "axios"; // NOTE: comment or remove this when AWS amplify is implemented
// import { Storage } from 'aws-amplify'; NOTE: uncomment this when AWS amplify is implemented

// VERY IMPORTANT NOTE: styling must be updated for this when AWS amplify is implemented
function ResumePreviewer({ fileKey }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPreviewUrl = async () => {
      try {
        setLoading(true);
        setError("");

        // Get pre-signed URL for preview from the backend
        const { data } = await axios.get("/api/preview-url", {
          params: { fileKey },
        });
        setPreviewUrl(data.previewUrl);
      } catch (error) {
        setError("Error loading resume preview.");
        console.error("Error fetching preview URL:", error);
      } finally {
        setLoading(false);
      }
    };

    // const fetchPreviewUrl = async () => {
    //     try {
    //       // Get the file URL from Amplify Storage
    //       const url = await Storage.get(fileKey); // Automatically handles signed URLs
    //       setPreviewUrl(url);
    //     } catch (error) {
    //       console.error('Error fetching preview URL:', error);
    // }
    // };
    // NOTE: uncomment this code and comment or remove all code above, up to useEffect, when AWS amplify is implemented

    if (fileKey) {
      fetchPreviewUrl();
    }
  }, [fileKey]);

  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-darkBlue mb-4">
        Preview Your Resume
      </h2>
      {loading ? (
        <p className="text-darkBlue">Loading preview...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : previewUrl ? (
        <iframe
          src={previewUrl}
          title="Resume Preview"
          className="w-full h-[300px] border rounded-lg"
        />
      ) : (
        <p className="text-darkBlue">No preview available</p>
      )}
    </div>
  );
}

export default ResumePreviewer;
