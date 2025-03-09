import React, { useState, useEffect } from "react";
import axios from "axios"; // Remove this once AWS Amplify is used
// import { Storage } from 'aws-amplify'; // Uncomment when AWS Amplify is used

function ResumePreviewer({ fileKey }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPreviewUrl = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch the pre-signed URL from the backend
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

    // AWS Amplify Version (Uncomment when switching to AWS Storage)
    // const fetchPreviewUrl = async () => {
    //   try {
    //     setLoading(true);
    //     setError('');
    //     const url = await Storage.get(fileKey); // Fetch signed URL
    //     setPreviewUrl(url);
    //   } catch (error) {
    //     setError('Error loading resume preview.');
    //     console.error('Error fetching preview URL:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

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
