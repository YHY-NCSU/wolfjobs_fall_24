import React, { useState } from "react";
import axios from "axios";
import ResumeDropzone from "../../components/Resume/ResumeDropzone";
import { useUserStore } from "../../store/UserStore";
import { toast } from "react-toastify";

const Resume: React.FC = () => {
  // State to store the uploaded file
  const [file, setFile] = useState<File | null>(null);

  // The current resume data
  const resumeName = useUserStore((state) => state.resume);
  const userId = useUserStore((state) => state.id);
  const updateResume = useUserStore((state) => state.updateResume);
  const updateResumeId = useUserStore((state) => state.updateResumeId); 

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("id", userId);

      try {
        const response = await axios.post(
          "http://localhost:8000/users/uploadresume",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          console.log("Resume uploaded successfully");
          toast.success("Resume Uploaded Successfully. Sign out and sign back in to see changes!");
        }
      } catch (error) {
        console.error("Error uploading the resume", error);
        toast.error("Resume could not be uploaded");
      }
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen"
      style={{
        backgroundImage: "url('/images/M.png')", // Update the path accordingly
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-4/5 md:w-1/3 bg-black bg-opacity-90 p-8 rounded-2xl shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-blue-200 mb-4">Upload Your Resume</h2>
        <p className="text-center text-blue-400 mb-6">
          Please upload your resume below to get started on your journey with us! 
          We are excited to see your skills and experience.
        </p>
        <ResumeDropzone
          onFileUpload={(acceptedFiles) => setFile(acceptedFiles[0])}
        />
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            Submit Resume
          </button>
        </div>

        {resumeName && (
          <div className="mt-6 text-center">
            <p className="text-gray-800">Your current resume is: <span className="font-semibold">{resumeName}</span></p>
            <a
              href={`/resumeviewer/${userId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 font-bold text-white bg-red-600 rounded-lg transition duration-200 hover:bg-red-700"
            >
              View Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;