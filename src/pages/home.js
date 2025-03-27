import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/sidebar";
import api from "../api/axios";

const fetchPrescriptions = async () => {
    const { data } = await api.get("/api/prescriptions/");
    return data;
};

export const Home = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["prescriptions"],
        queryFn: fetchPrescriptions,
    });

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
                                <th className="border p-2">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((prescription) => (
                                <tr key={prescription.id} className="hover:bg-gray-50">
                                    <td className="border p-2 text-center">{prescription.SNo}</td>
                                    <td className="border p-2">{prescription.doctorName}</td>
                                    <td className="border p-2">{prescription.department}</td>
                                    <td className="border p-2">{prescription.patientName}</td>
                                    <td className="border p-2 text-center">{prescription.gender}</td>
                                    <td className="border p-2 text-center">{prescription.age}</td>
                                    <td className="border p-2">{prescription.contactNumber}</td>
                                    <td className="border p-2">{prescription.optionalTextBox || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
