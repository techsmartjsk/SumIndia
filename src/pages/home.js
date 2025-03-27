import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/sidebar";
import api from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

const fetchPrescriptions = async () => {
  const { data } = await api.get("/api/prescriptions/");
  return data;
};

const deletePrescription = async (id) => {
  await api.delete(`/api/prescriptions/${id}`);
};

const queryClient = new QueryClient();

export const Home = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: fetchPrescriptions,
  });

  const mutation = useMutation({
    mutationFn: deletePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const prescriptionRef = useRef(null);

  const handlePrint = async (id) => {
    const prescriptionElement = document.getElementById(`prescription-${id}`);
  
    if (!prescriptionElement) return;
  
    prescriptionElement.style.display = "block";
  
    await new Promise(resolve => setTimeout(resolve, 500)); // Ensure everything loads properly
  
    html2canvas(prescriptionElement, { useCORS: true, allowTaint: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
  
        // Open the PDF in a new tab instead of downloading
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const newWindow = window.open(pdfUrl, "_blank");
  
        if (newWindow) {
          newWindow.onload = () => {
            newWindow.print();
          };
        } else {
          console.error("Popup blocked! Allow popups for printing.");
        }
      })
      .catch((error) => {
        console.error("Error capturing screenshot:", error);
      })
      .finally(() => {
        prescriptionElement.style.display = "none"; // Hide it again
      });
  };
  
  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading prescriptions: {error.message}</p>;

  return (
    <div className="flex gap-x-1">
      <Sidebar />
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">SNo</th>
                <th className="border p-2">Doctor</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Patient</th>
                <th className="border p-2">Gender</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((prescription, index) => (
                <tr key={prescription.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{prescription.doctorName}</td>
                  <td className="border p-2">{prescription.department}</td>
                  <td className="border p-2">{prescription.patientName}</td>
                  <td className="border p-2 text-center">
                    {prescription.gender}
                  </td>
                  <td className="border p-2 text-center">{prescription.age}</td>
                  <td className="border p-2">{prescription.contactNumber}</td>
                  <td className="border p-2 flex gap-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePrint(prescription.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hidden prescription details for PDF generation */}
          {data.map((prescription) => (
            <div
              key={prescription.id}
              id={`prescription-${prescription.id}`}
              className="hidden p-6 bg-white border rounded shadow-md"
            >
              <h2 className="text-xl font-bold mb-2">Prescription Details</h2>
              <p>
                <strong>Doctor:</strong> {prescription.doctorName}
              </p>
              <p>
                <strong>Department:</strong> {prescription.department}
              </p>
              <p>
                <strong>Patient:</strong> {prescription.patientName}
              </p>
              <p>
                <strong>Gender:</strong> {prescription.gender}
              </p>
              <p>
                <strong>Age:</strong> {prescription.age}
              </p>
              <p>
                <strong>Contact:</strong> {prescription.contactNumber}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
