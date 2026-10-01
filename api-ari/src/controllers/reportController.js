import pool from "../bd/db.js";
import crypto from "crypto";

// Seleccionar reporte
const seleccionar_reportes = async function (_, res) {
    try {
        // Consulta todos los reportes
        const sql1 = "SELECT * FROM reportes";
        const [rows] = await pool.query(sql1);

        if (rows.length === 0) {
            return res.status(404).send("Error no hay reportes");
        }

        // Convertir token de Buffer a string hexadecimal
        const reportesConToken = rows.map(reporte => ({
            ...reporte,
            token: reporte.token.toString('hex')
        }));

        res.status(200).send(reportesConToken);
    } catch (error) {
        console.error("Error al consultar reportes: ", error);
        res.status(500).send("Error del servidor");
    }
};

// Actualizar reporte
const actualizar_reporte = async function (req, res) {
    try {
        // Obtiene todos los datos
        const id = req.params.id;
        const { token, ...resto } = req.body;
        const reporteEditado = {
            ...resto,
            token: Buffer.from(token, "hex")
        };

        // Construir la consulta de actualización
        const sql = "UPDATE reportes SET ? WHERE id = ?";
        const [reg] = await pool.query(sql, [reporteEditado, id]);

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
        const { token, ...resto } = req.body;
        const reporteNuevo = {
            ...resto,
            token: Buffer.from(token, "hex")
        };

        // Construir la consulta de inserción
        const sql = "INSERT INTO reportes SET ?";
        const [reg] = await pool.query(sql, reporteNuevo);

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

const crear_token = async function (_, res) {
    try {
        // Verificar si ya existen reportes en la tabla
        const [countRows] = await pool.query("SELECT COUNT(*) AS count FROM reportes");
        const totalReportes = countRows[0].count;

        // Generar token aleatorio de 16 bytes (BINARY(16))
        const generarToken = () => crypto.randomBytes(16);
        let token = generarToken();

        if (totalReportes > 0) {
            // Si hay al menos un registro, verificar que el token no exista
            const tokenExiste = async (tokenValue) => {
                const sqlCheck = "SELECT 1 FROM reportes WHERE token = ? LIMIT 1";
                const [rows] = await pool.query(sqlCheck, [tokenValue]);
                return rows.length > 0;
            };

            let existe = await tokenExiste(token);
            while (existe) {
                token = generarToken();
                existe = await tokenExiste(token);
            }
        }

        res.status(201).send({ token: token.toString("hex") });
    } catch (error) {
        console.error("Error al crear token: ", error);
        res.status(500).send("Error del servidor");
    }
};

export {
    seleccionar_reportes,
    actualizar_reporte,
    insertar_reporte,
    eliminar_reporte,
    crear_token
};