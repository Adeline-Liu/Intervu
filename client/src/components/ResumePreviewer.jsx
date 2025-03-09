import React from "react";

function ResumePreviewer({ fileUrl }) {
  return (
    <div className="w-full h-[600px] flex flex-col items-center justify-center bg-beige border border-gray-300 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-darkBlue mb-4">
        Preview Your Resume
      </h2>
      {fileUrl ? (
        <iframe
          src={fileUrl}
          title="Resume Preview"
          className="w-full h-[500px] border rounded-lg"
        />
      ) : (
        <p className="text-darkBlue">No preview available</p>
      )}
    </div>
  );
}

export default ResumePreviewer;
