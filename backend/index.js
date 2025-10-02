const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Conexión a MongoDB Atlas
mongoose.connect(
  "mongodb+srv://zharicklinnethdeleonmartinez_db_user:ZX46OgDaCpV1etCU@cluster0.8ud0hyj.mongodb.net/gestorPacientes?retryWrites=true&w=majority&appName=Cluster0",
  {
    serverSelectionTimeoutMS: 10000, // espera 10s antes de fallar
  }
)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

// 🔹 Esquema y modelo de Pacientes
const pacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  diagnostico: { type: String, required: true },
}, { timestamps: true }); // agrega createdAt y updatedAt

const Paciente = mongoose.model("Paciente", pacienteSchema);

// 🔹 Rutas API (CRUD)
// 👉 Obtener todos los pacientes
app.get("/pacientes", async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
});

// 👉 Crear un nuevo paciente
app.post("/pacientes", async (req, res) => {
  try {
    const nuevo = new Paciente(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: "Error al crear paciente", detalles: err.message });
  }
});

// 👉 Actualizar paciente
app.put("/pacientes/:id", async (req, res) => {
  try {
    const actualizado = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar paciente", detalles: err.message });
  }
});

// 👉 Eliminar paciente
app.delete("/pacientes/:id", async (req, res) => {
  try {
    const eliminado = await Paciente.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }
    res.json({ mensaje: "Paciente eliminado" });
  } catch (err) {
    res.status(400).json({ error: "Error al eliminar paciente", detalles: err.message });
  }
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:5000`);
});
