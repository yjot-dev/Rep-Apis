import pool from "../bd/db.js";

// Verifica si el objeto esta vacio
function isEmptyObject(obj) {
    return !Object.keys(obj) || Object.keys(obj).length === 0;
};

// Seleccionar reporte
const seleccionar_reportes = async function (_, res) {
    try {
        // Consulta todos los reportes
        const sql1 = "SELECT * FROM reportes";
        const [rows] = await pool.query(sql1);
        console.log("Salida:", rows);

        if (isEmptyObject(rows)) {
            return res.status(404).send("Error no hay reportes");
        }

        res.status(200).send(rows);
    } catch (error) {
        console.error("Error al consultar reportes: ", error);
        res.status(500).send("Error del servidor");
    }
};

// Actualizar reporte
const actualizar_reporte = async function (req, res) {
    try {
        const id = req.params.id;
        // Obtiene todos los datos
        const usuarioEditado = req.body;

        // Construir la consulta de actualización
        const sql = "UPDATE reportes SET ? WHERE id = ?";
        const [reg] = await pool.query(sql, [usuarioEditado, id]);

        // Verificar si se actualizó alguna fila
        if (reg.affectedRows === 0) {
            return res.status(404).send("Error reporte no encontrado");
        }

        res.status(200).send(reg);
    } catch (error) {
        console.error("Error al actualizar reporte: ", error);
        res.status(500).send("Error del servidor");
    }
};

// Insertar reporte
const insertar_reporte = async function (req, res) {
    try {
        // Obtiene todos los datos
        const usuarioNuevo = req.body;

        // Construir la consulta de inserción
        const sql = "INSERT INTO reportes SET ?";
        const [reg] = await pool.query(sql, usuarioNuevo);

        res.status(201).send(reg);
    } catch (error) {
        console.error("Error al insertar reporte: ", error);
        res.status(500).send("Error del servidor");
    }
};

// Eliminar reporte
const eliminar_reporte = async function (req, res) {
    try {
        const id = req.params.id

        // Construir la consulta de eliminación
        const sql = "DELETE FROM reportes WHERE id = ?";
        const [reg] = await pool.query(sql, [id]);

        // Verificar si se actualizó alguna fila
        if (reg.affectedRows === 0) {
            return res.status(404).send("Error reporte no encontrado");
        }

        res.status(200).send(reg);
    } catch (error) {
        console.error("Error al eliminar reporte: ", error);
        res.status(500).send("Error del servidor");
    }
}

export {
    seleccionar_reportes,
    actualizar_reporte,
    insertar_reporte,
    eliminar_reporte
};