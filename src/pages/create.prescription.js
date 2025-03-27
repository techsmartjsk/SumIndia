import { PrescriptionForm } from "../components/prescription.form";
import { Sidebar } from "../components/sidebar";

export const CreatePrescription = () => {
  return (
    <div className="flex gap-x-1">
      <div className="w-[25%]">
        <Sidebar />
      </div>
      <PrescriptionForm />
    </div>
  );
};
