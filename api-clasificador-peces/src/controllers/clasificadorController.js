import pool from "../bd/db.js";

// Seleccionar especies
const seleccionar_especies = async function (req, res) {
    try {
        const { searchedText } = req.query;

        // Consulta todas las especies si no hay texto de búsqueda
        let sql = "SELECT * FROM especies";
        let params = [];
        if (searchedText) {
            sql += " WHERE LOWER(tipo) LIKE LOWER(?) OR LOWER(nombreComun) LIKE LOWER(?) OR LOWER(nombreCientifico) LIKE LOWER(?)";
            params.push(`%${searchedText}%`);
            params.push(`%${searchedText}%`);
            params.push(`%${searchedText}%`);
        }
        sql += " ORDER BY nombreComun ASC";
        const [rows] = await pool.query(sql, params);

        if (rows.length === 0) {
            return res.status(404).send("Error no hay especies");
        }

        res.status(200).send(rows);
    } catch (error) {
        console.error("Error al consultar especies: ", error);
        res.status(500).send("Error del servidor");
    }
};

export {
    seleccionar_especies
};