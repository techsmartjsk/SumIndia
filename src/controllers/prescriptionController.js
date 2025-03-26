const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPrescription = async (req, res) => {
  try {
    const prescription = await prisma.prescription.create({
      data: req.body,
    });

    res.json({ message: "Prescription added", prescription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await prisma.prescription.findUnique({
      where: { id: id },
    });

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a prescription by ID
exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPrescription = await prisma.prescription.update({
      where: { id: id },
      data: req.body,
    });

    res.json({ message: "Prescription updated", updatedPrescription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a prescription by ID
exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.prescription.delete({
      where: { id: id },
    });

    res.json({ message: "Prescription deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
