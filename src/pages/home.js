import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/sidebar";
import api from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import isp from "../assets/ISPv.png";
import alr2 from "../assets/Alr2.png";
import alr3 from "../assets/Alr3.png";
import px from "../assets/Px.png";
import syr1 from "../assets/Syr1.png";
import logo from "../assets/logo.png";
import { Globe, Mail, Phone } from "lucide-react";

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

    await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure everything loads properly

    html2canvas(prescriptionElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const imgWidth = canvas.width * 0.264583; // Convert px to mm (1 px ≈ 0.264583 mm)
        const imgHeight = canvas.height * 0.264583;

        // Create a PDF exactly the size of the image
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? "l" : "p",
          unit: "mm",
          format: [imgWidth, imgHeight], // No margins at all
        });

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, "", "FAST");

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

          {data.map((prescription) => (
            <div
              key={prescription.id}
              id={`prescription-${prescription.id}`}
              className="bg-white rounded-lg shadow-lg max-w-2xl w-full w-[794px] h-[1123px]"
            >
              <div className="flex gap-x-2 items-center justify-center bg-[#dce9f5] h-[80px]">
                <img src={isp} className="w-[20%]"></img>
                <img src={px} className="w-[30%]"></img>
                <img src={alr2} className="w-[20%]"></img>
                <img src={alr3} className="w-[10%]"></img>
                <img src={syr1} className="w-[10%]"></img>
              </div>
              <div className="flex bg-[#dce9f5]">
                <div className="bg-[#162c4c] h-[100px] flex flex-col justify-center w-[80%]">
                  <p className="text-white font-bold text-4xl text-center">
                    OPD Card <span className="text-[#2dabde]">Health Camp</span>
                  </p>
                  <p className="mt-2 flex flex-row items-center gap-x-2 justify-center">
                    <div className="w-[20px] h-[2px] bg-[#2dacde]"></div>
                    <p className="uppercase text-white">
                      Community Relief Programme
                    </p>
                  </p>
                </div>
                <div className="w-[2%]"></div>
                <div className="bg-[#2dabde] w-[18%] flex items-center justify-center">
                  <img
                    src={logo}
                    className="bg-white rounded-full h-[80px] my-auto"
                  ></img>
                </div>
              </div>
              <div className="flex items-center justify-center gap-x-1 py-2">
                <div className="flex gap-x-2 items-center">
                  <div>
                    <Phone className="text-[#2cacde]" size={14} />
                  </div>
                  <p className="text-sm font-bold">+91 81307 23707</p>
                </div>
                <div className="flex gap-x-2 items-center">
                  <div>
                    <Mail className="text-[#2cacde]" size={14} />
                  </div>
                  <p className="text-sm font-bold">
                    Socialupmovementindia@gmail.com
                  </p>
                </div>
                <div className="flex gap-x-2 items-center">
                  <div>
                    <Globe className="text-[#2cacde]" size={14} />
                  </div>
                  <p className="text-sm font-bold">www.Sumindia.com</p>
                </div>
              </div>

              <div className="px-10">
                <div className="flex items-center py-2">
                  <div className="bg-[#2dacde] w-[10px] py-1 h-[36px]"></div>
                  <p className="text-white bg-[#172b4c] w-full py-1 px-5 uppercase text-lg flex items-center">
                    Registration Form
                  </p>
                </div>
              </div>
              <div className="px-10">
                <div className="flex items-center justify-center gap-x-10">
                  <div className="w-[30%]">
                    <p className="text-sm font-bold">Registration Number:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-[40%]">
                    <p className="text-sm font-bold">Department:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-[30%]">
                    <p className="text-sm font-bold">Date:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                </div>
              </div>
              <div className="px-10">
                <div className="flex items-center py-2">
                  <div className="bg-[#2dacde] w-[10px] py-1 h-[36px]"></div>
                  <p className="text-white bg-[#172b4c] w-full py-1 px-5 uppercase text-lg flex items-center">
                    Personal Information
                  </p>
                </div>
              </div>
              <div className="px-10">
                <div className="flex flex-wrap gap-x-4">
                  <div className="w-full">
                    <p className="text-sm font-bold">Patient Name</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-bold">S/O W/O D/O:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-[30%]">
                    <p className="text-sm font-bold">Age:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-[30%]">
                    <p className="text-sm font-bold">Gender:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-[30%]">
                    <p className="text-sm font-bold">Contact No:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-[30%]">
                    <p className="text-sm font-bold">H No:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-[60%]">
                    <p className="text-sm font-bold">Res Add:</p>
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                  <div className="w-full mb-2">
                    <div className="bg-[#dce9f5] h-[30px] mt-2"></div>
                  </div>
                </div>
              </div>
              <div className="px-10">
                <div className="h-[500px] bg-[#dce9f5] w-full">
                  <div className="absolute ml-32 h-[500px] bg-gray-400 w-[2px]"></div>
                  <div className="flex items-center h-full justify-center">
                    <img src={logo} className="w-[150px]"></img>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
