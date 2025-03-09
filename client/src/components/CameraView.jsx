// CameraView.jsx
import React, { useRef, useEffect } from "react";

const CameraView = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Access the user's camera
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    };

    enableCamera();

    return () => {
      // Cleanup: stop the camera when the component is unmounted
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "60%", borderRadius: "15px" }}
      />
    </div>
  );
};

export default CameraView;
