import { useState } from "react";
import api from "../api/axios";

const departments = [
  "Orthopedic",
  "Eye",
  "Dental",
  "Legal aid",
  "Pharmacy",
  "Physiotherapy",
  "ECG",
  "Neurology",
  "Gynae",
  "Internal medicine",
  "Pediatric",
  "Lab testing",
  "BP sugar",
  "Alternate Medicine / Alternate Therapy",
];

export const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    Admin: "",
    doctorName: "",
    department: "",
    patientName: "",
    relativeName: "",
    gender: "",
    DOB: "",
    address: "",
    contactNumber: "",
    optionalTextBox: "",
  });

  const generateRegistrationNumber = () =>
    `REG${Math.floor(100000 + Math.random() * 900000)}`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPrescription = {
      ...formData,
      registrationNumber: generateRegistrationNumber(),
      dateTime: new Date().toISOString(),
      age: new Date().getFullYear() - new Date(formData.DOB).getFullYear(),
    };

    try {
      await api.post("/api/prescriptions/", newPrescription);
      alert("Prescription Created Successfully!");
      setFormData({
        admin: "",
        doctorName: "",
        department: "",
        patientName: "",
        relativeName: "",
        gender: "",
        DOB: "",
        address: "",
        contactNumber: "",
        optionalTextBox: "",
      });
    } catch (error) {
      alert("Error creating prescription: " + error.message);
    }
  };

  return (
    <div className="py-20 mx-auto bg-white px-32">
      <h2 className="text-2xl font-bold mb-4">Create Prescription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="Admin"
          placeholder="Admin"
          value={formData.Admin}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="doctorName"
          placeholder="Doctor Name"
          value={formData.doctorName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={formData.patientName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="relativeName"
          placeholder="Relative Name"
          value={formData.relativeName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="DOB"
          value={formData.DOB}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="optionalTextBox"
          placeholder="Additional Details (Optional)"
          value={formData.optionalTextBox}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
