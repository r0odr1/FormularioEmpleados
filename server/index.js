const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ruta para consultar todos los emmpleados
app.get("/empleados", (req, res) => {
  const sql = "SELECT * FROM empleados";

  db.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener los datos del empleado" });
    }
    return res.json(results);
  });
});

// ruta para crear todos los emmpleados
app.post("/empleados", (req, res) => {
  const { nombre, edad, pais, cargo, anios } = req.body;
  const sql =
    "INSERT INTO empleados (nombre, edad, pais, cargo, anios, sueldo, correo, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [nombre, edad, pais, cargo, anios, sueldo, correo, telefono],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al guardar los datos del empleado" });
      }
      return res.json({
        message: "Empleado guardado exitosamente",
        id: result.insertId,
        nombre,
        edad,
        pais,
        cargo,
        anios,
        sueldo,
        correo,
        telefono,
      });
    },
  );
});

// ruta para actualizar un empleado por id
app.put("/empleados/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, edad, pais, cargo, anios, sueldo, correo, telefono } =
    req.body;
  const sql =
    "UPDATE empleados SET nombre = ?, edad = ?, pais = ?, cargo = ?, anios = ?, sueldo = ?, correo = ?, telefono = ? WHERE id = ?";

  db.query(
    sql,
    [nombre, edad, pais, cargo, anios, sueldo, correo, telefono, id],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al actualizar el empleado" });
      }
      return res.json({
        message: "Empleado actualizado exitosamente: ",
        id,
        nombre,
        edad,
        pais,
        cargo,
        anios,
        sueldo,
        correo,
        telefono,
      });
    },
  );
});

// ruta para eliminar un empleado por id
app.delete("/empleados/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM empleados WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar el empleado" });
    }
    return res.json({ message: "Empleado eliminado exitosamente: ", id });
  });
});

app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});
