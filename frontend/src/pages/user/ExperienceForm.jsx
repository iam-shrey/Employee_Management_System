import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMinus, HiPlus, HiArrowSmLeft, HiOutlineSave } from "react-icons/hi";
import { toast } from "react-toastify";

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([
        {
          experience: "",
          companyName: "",
          duration: "",
          role: "",
          experienceLetter: null,
          offerLetter: null,
        },
      ]
  );

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newExperiences = [...experiences];
    newExperiences[index][name] = value;
    setExperiences(newExperiences);
  };

  const handleFileChange = (e, index) => {
    const { name, files } = e.target;
    const newExperiences = [...experiences];
    newExperiences[index][name] = files[0];
    setExperiences(newExperiences);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        experience: "",
        companyName: "",
        duration: "",
        role: "",
        experienceLetter: null,
        offerLetter: null,
      },
    ]);
  };

  const handleRemoveExperience = (index) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  const handleModalOpen = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    experiences.forEach((experience, index) => {
      formData.append("experience", experience.experience);
      formData.append("companyName", experience.companyName);
      formData.append("duration", experience.duration);
      formData.append("role", experience.role);
      if (experience.experienceLetter) {
        formData.append("experienceLetter", experience.experienceLetter);
      }
      if (experience.offerLetter) {
        formData.append("offerLetter", experience.offerLetter);
      }
    });

    try {
      if (experiences.length > 0) {
        const responseExp = await apiClient.post("/users/experiences", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/welcome")
      toast.success(`Data Submitted and Onboard Completes!`);
    } catch (error) {
      console.error(error);
      alert("Failed to save data!");
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <form onSubmit={handleModalOpen} className="space-y-6 p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700">Add Your Experiences</h2>
          {experiences.map((experience, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">Experience {index + 1}</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`experience-${index}`} className="block text-sm font-medium text-gray-700">
                    Summary
                  </label>
                  <input
                    id={`experience-${index}`}
                    type="text"
                    name="experience"
                    value={experience.experience}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`companyName-${index}`} className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    id={`companyName-${index}`}
                    type="text"
                    name="companyName"
                    value={experience.companyName}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`duration-${index}`} className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    id={`duration-${index}`}
                    type="text"
                    name="duration"
                    value={experience.duration}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`role-${index}`} className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    id={`role-${index}`}
                    type="text"
                    name="role"
                    value={experience.role}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`experienceLetter-${index}`} className="block text-sm font-medium text-gray-700">
                  Experience Letter
                </label>
                <input
                  id={`experienceLetter-${index}`}
                  type="file"
                  required
                  name="experienceLetter"
                  onChange={(e) => handleFileChange(e, index)}
                  className="cursor-pointer mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor={`offerLetter-${index}`} className="block text-sm font-medium text-gray-700">
                  Offer Letter
                </label>
                <input
                  id={`offerLetter-${index}`}
                  type="file"
                  name="offerLetter"
                  required
                  onChange={(e) => handleFileChange(e, index)}
                  className="cursor-pointer mt-1 w-full block text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {experiences.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="mt-2 bg-red-500 rounded-lg px-6 py-2 text-white hover:bg-red-600"
                >
                  <HiMinus className="inline" /> Remove Experience
                </button>
              )}
            </div>
          ))}

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleAddExperience}
              className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
            >
              <HiPlus className="inline" /> {experiences.length > 0 ? "Add Another Experience" : "Add Experience"}
            </button>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <HiArrowSmLeft className="inline" /> Prev
            </button>

            <button
              type="submit"
              className="px-4 py-2 self-center block bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <HiOutlineSave className="inline" /> Save
            </button>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold">Are you sure you want to submit ?</h3>
            <h2 className="mt-4 text-base font-semibold">( Check the details Carefully before onboarding! )</h2>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Onboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExperienceForm;
