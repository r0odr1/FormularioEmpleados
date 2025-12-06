import { useEffect, useState } from "react";
import "./App.css"; // Importamos los estilos de la aplicación

function App() {
  //Estados para guardar lo que el usuario escribe en el formulario
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState(0);
  const [sueldo, setSueldo] = useState(0);
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  // lista que contenga todos los empleados que se registren
  const [registros, setRegistros] = useState([]);

  //Este estado se usa para saber si estamos editando un empleado existente
  // Si es null es un nuevo registro y si tiene un valor es el indice del empleado
  const [editIndex, setEditIndex] = useState(null); // Indice del registo que se esta editando

  //Cuando se carga la pagina, obtenemos los empleados desde el backend
  const cargarEmpleados = async () => {
    try {
      const response = await fetch("http://localhost:3001/empleados");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert("Error al cargar los empleados: " + error.message);
    }
  };

  // Cuando se carga la pagina, obtenemos los empleados desde el backend
  useEffect(() => {
    cargarEmpleados();
  }, []); // Se sigue ejecutando solo al inicio (montaje)

  // Esta funcion se ejecuta al presionar el boton de registrar o actualizar
  const registrarDatos = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Estaremos editando un empleado existente
      try {
        const empleado = registros[editIndex];
        const response = await fetch(
          `http://localhost:3001/empleados/${empleado.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre,
              edad,
              pais,
              cargo,
              anios,
              sueldo,
              correo,
              telefono,
            }),
          },
        );

        if (response.ok) {
          // 💡 CAMBIO CLAVE 2a: En lugar de actualizar el estado local (complejo y propenso a errores),
          // simplemente recargamos toda la lista.
          await cargarEmpleados();
          setEditIndex(null);
          alert("Empleado actualizado correctamente");
        } else {
          alert("Error al actualizar el empleado");
        }
      } catch (error) {
        alert("Error de conexion al actualizar: " + error.message);
      }
    } else {
      // Si es un nuevo empleado
      try {
        const response = await fetch("http://localhost:3001/empleados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            edad,
            pais,
            cargo,
            anios,
            sueldo,
            correo,
            telefono,
          }),
        });

        if (response.ok) {
          // 💡 CAMBIO CLAVE 2b: Recargamos la lista después de la creación exitosa
          await cargarEmpleados();
          alert("Empleado creado correctamente");
        } else {
          alert("Error al crear el empleado");
        }
      } catch (error) {
        alert("Error de conexion al crear: " + error.message);
      }
    }

    // Limpiar formulario después de cualquier operación (éxito o error de conexión)
    setNombre("");
    setEdad(0);
    setPais("");
    setCargo("");
    setAnios(0);
    setSueldo(0);
    setCorreo("");
    setTelefono("");
  };

  const eliminarRegistro = async (idx) => {
    const empleado = registros[idx];
    try {
      const response = await fetch(
        `http://localhost:3001/empleados/${empleado.id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // 💡 CAMBIO CLAVE 3: Recargamos la lista después de la eliminación exitosa
        await cargarEmpleados();

        // Limpiamos el modo edición si el registro eliminado era el que se estaba editando
        if (editIndex === idx) {
          setEditIndex(null);
          setNombre("");
          setEdad(0);
          setPais("");
          setCargo("");
          setAnios(0);
          setSueldo(0);
          setCorreo("");
          setTelefono("");
        }
        alert("Empleado eliminado correctamente: " + empleado.id);
      } else {
        alert("Error al eliminar el empleado");
      }
    } catch (error) {
      alert("Error de conexion al eliminar: " + error.message);
    }
  };

  const editarRegistro = (idx) => {
    const registrar = registros[idx];
    setNombre(registrar.nombre);
    setEdad(registrar.edad);
    setPais(registrar.pais);
    setCargo(registrar.cargo);
    setAnios(registrar.anios);
    setSueldo(registrar.sueldo);
    setCorreo(registrar.correo);
    setTelefono(registrar.telefono);
    setEditIndex(idx);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Gestión de Empleados 👨‍💼</h1>
      </header>
      <section className="form-section">
        <div className="card" id="formulario-empleados">
          <h2>
            {editIndex !== null
              ? "🖊️ Editar Empleado"
              : "➕ Registrar Nuevo Empleado"}
          </h2>
          <form onSubmit={registrarDatos}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                class="a"
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="edad">Edad:</label>
                <input
                  type="number"
                  id="edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  placeholder="25"
                  min="0"
                  required
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="pais">País:</label>
                <input
                  type="text"
                  id="pais"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  placeholder="Ej: Colombia"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="cargo">Cargo:</label>
                <input
                  type="text"
                  id="cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ej: Desarrollador"
                  required
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="anios">Años de Exp:</label>
                <input
                  type="number"
                  id="anios"
                  value={anios}
                  onChange={(e) => setAnios(e.target.value)}
                  placeholder="3"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="cargo">sueldo:</label>
                <input
                  type="text"
                  id="sueldo"
                  value={sueldo}
                  onChange={(e) => setSueldo(e.target.value)}
                  placeholder="Ej: $2000"
                  required
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Ej: correo@ejemplo.com"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="text"
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: +1234567890"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn primary-btn">
              {editIndex !== null
                ? "Actualizar Empleado"
                : "Registrar Empleado"}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                className="btn secondary-btn"
                onClick={() => {
                  setEditIndex(null);
                  setNombre("");
                  setEdad(0);
                  setPais("");
                  setCargo("");
                  setAnios(0);
                  setSueldo(0);
                  setCorreo("");
                  setTelefono("");
                }}
              >
                Cancelar Edición
              </button>
            )}
          </form>
        </div>
      </section>
      ---
      <section className="list-section">
        <h2>📋 Lista de Empleados ({registros.length})</h2>
        <div className="empleados-grid">
          {registros.length > 0 ? (
            registros.map((registro, idx) => (
              // Usar 'registro.id' como key si existe, o el índice como fallback
              <div key={registro.id || idx} className="empleado-card">
                <p>
                  <strong>{registro.nombre}</strong>
                </p>
                <p>
                  📍 {registro.pais} | 🎂 {registro.edad} años
                </p>
                <p>
                  💼 {registro.cargo} ({registro.anios} años de exp.)
                </p>
                <p>💰 {registro.sueldo}</p>
                <p>✉️ {registro.correo}</p>
                <p>📞 {registro.telefono}</p>
                <div className="actions">
                  <button
                    onClick={() => editarRegistro(idx)}
                    className="btn small-btn edit-btn"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarRegistro(idx)}
                    className="btn small-btn delete-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-registros">
              No hay empleados registrados. ¡Empieza a agregar!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
