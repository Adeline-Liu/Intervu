import React, { useState, useEffect } from 'react';
import axios from 'axios'; // NOTE: comment or remove this when AWS amplify is implemented
// import { Storage } from 'aws-amplify'; NOTE: uncomment this when AWS amplify is implemented

// VERY IMPORTANT NOTE: styling must be updated for this when AWS amplify is implemented
function ResumePreviewer({ fileKey }) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const fetchPreviewUrl = async () => {
      try {
        // Get pre-signed URL for preview from the backend
        const { data } = await axios.get('/api/preview-url', { params: { fileKey } });
        setPreviewUrl(data.previewUrl);
      } catch (error) {
        console.error('Error fetching preview URL:', error);
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
    <div style = {{backgroundColor: "green"}} role="region" aria-labelledby="PreviewResume">
      <h2 id="PreviewResume">Preview Your Resume</h2>
      {previewUrl ? (
        <iframe
          src={previewUrl}
          title="Resume Preview"
          style={{ width: '100%', height: '600px', border: 'none' }}
        />
      ) : (
        <p>No preview available</p>
      )}
    </div>
  );
}

export default ResumePreviewer;

