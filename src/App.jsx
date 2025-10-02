import { useState } from "react";

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [nuevoPaciente, setNuevoPaciente] = useState({ nombre: "", edad: "", diagnostico: "" });

  // Manejar cambios en inputs
  const handleChange = (e) => {
    setNuevoPaciente({ ...nuevoPaciente, [e.target.name]: e.target.value });
  };

  // Agregar paciente
  const agregarPaciente = () => {
    if (!nuevoPaciente.nombre || !nuevoPaciente.edad || !nuevoPaciente.diagnostico) return;
    setPacientes([...pacientes, { ...nuevoPaciente, id: Date.now() }]);
    setNuevoPaciente({ nombre: "", edad: "", diagnostico: "" });
  };

  // Borrar paciente
  const borrarPaciente = (id) => {
    setPacientes(pacientes.filter((p) => p.id !== id));
  };

  return (
    <div style={{ margin: "20px", fontFamily: "Arial" }}>
      <h1>Gestor de Pacientes</h1>

      <h2>Agregar paciente</h2>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={nuevoPaciente.nombre}
        onChange={handleChange}
      />
      <input
        type="number"
        name="edad"
        placeholder="Edad"
        value={nuevoPaciente.edad}
        onChange={handleChange}
      />
      <input
        type="text"
        name="diagnostico"
        placeholder="Diagnóstico"
        value={nuevoPaciente.diagnostico}
        onChange={handleChange}
      />
      <button onClick={agregarPaciente}>Agregar</button>

      <h2>Lista de Pacientes</h2>
      <ul>
        {pacientes.map((paciente) => (
          <li key={paciente.id}>
            {paciente.nombre} - {paciente.edad} años - {paciente.diagnostico}
            <button onClick={() => borrarPaciente(paciente.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
