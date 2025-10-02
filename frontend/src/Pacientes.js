import React, { useEffect, useState } from "react";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", edad: "", diagnostico: "" });
  const [editando, setEditando] = useState(null);

  // Cargar pacientes al iniciar
  useEffect(() => {
    fetch("http://localhost:5000/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((err) => console.error("Error al cargar pacientes:", err));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar paciente (nuevo o editado)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editando) {
      // Modo edición
      const res = await fetch(`http://localhost:5000/pacientes/${editando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const actualizado = await res.json();
      setPacientes(
        pacientes.map((p) => (p._id === actualizado._id ? actualizado : p))
      );
      setEditando(null);
    } else {
      // Modo crear
      const res = await fetch("http://localhost:5000/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const nuevo = await res.json();
      setPacientes([...pacientes, nuevo]);
    }

    setForm({ nombre: "", edad: "", diagnostico: "" }); // limpiar formulario
  };

  // Eliminar paciente
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/pacientes/${id}`, { method: "DELETE" });
    setPacientes(pacientes.filter((p) => p._id !== id));
  };

  // Cargar datos en formulario para editar
  const handleEdit = (paciente) => {
    setForm({
      nombre: paciente.nombre,
      edad: paciente.edad,
      diagnostico: paciente.diagnostico,
    });
    setEditando(paciente._id);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Gestión de Pacientes</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={form.edad}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="diagnostico"
          placeholder="Diagnóstico"
          value={form.diagnostico}
          onChange={handleChange}
          required
        />
        <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>
        {editando && (
          <button
            type="button"
            onClick={() => {
              setEditando(null);
              setForm({ nombre: "", edad: "", diagnostico: "" });
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de pacientes */}
      <h2>Lista de Pacientes</h2>
      <ul>
        {pacientes.map((p) => (
          <li key={p._id}>
            <b>{p.nombre}</b> ({p.edad} años) - {p.diagnostico}
            <button
              onClick={() => handleEdit(p)}
              style={{ marginLeft: "10px" }}
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(p._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pacientes;
