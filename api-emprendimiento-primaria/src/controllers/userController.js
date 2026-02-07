import pool from "../bd/db.js";
import bcrypt from "bcrypt";

// Verifica si el objeto esta vacio
function isEmptyObject(obj) {
    return !Object.keys(obj) || Object.keys(obj).length === 0;
};

// Seleccionar usuario
const findUser = async function (req, res) {
    try {
        const { nombre, clave } = req.body;
        console.log("Entrada:", req.body);

        // Consulta para obtener el usuario por nombre o correo
        const sql = "SELECT * FROM usuarios WHERE correo = ? OR nombre = ?";
        const [rows] = await pool.query(sql, [nombre, nombre]);
        console.log("Salida:", rows);

        if (isEmptyObject(rows)) {
            return res.status(404).send("Error usuario no encontrado");
        }

        const usuario = rows[0];

        // Comparar la clave ingresada con la clave encriptada almacenada
        const esLaClave = await bcrypt.compare(clave, usuario.clave);
        if (!esLaClave) {
            return res.status(401).send("Error clave incorrecta");
        }

        // Convertir el campo foto (MediumBlob) a una cadena Base64
        if (usuario.foto) {
            usuario.foto = Buffer.from(usuario.foto).toString("base64");
        }

        res.status(200).send(usuario);
    } catch (error) {
        console.error("Error al seleccionar usuario: ", error);
        res.status(500).send("Error del servidor");
    }
};

// Actualizar usuario
const updateUser = async function (req, res) {
    try {
        const id = req.params.id;
        // Desestructura clave y foto, y recoge el resto de los datos
        let { clave, foto, ...resto } = req.body;

        // Consulta para obtener la clave del usuario
        const sql1 = "SELECT clave FROM usuarios WHERE id = ?";
        const reg1 = await pool.query(sql1, [id]);

        if (isEmptyObject(reg1)) {
            return res.status(500).send("Error clave no encontrada");
        }

        const claveHash = (reg1[0])[0].clave;

        // Comparar la clave ingresada con la clave hash almacenada
        const esLaClave = await bcrypt.compare(clave, claveHash);
        if (!esLaClave) {
            clave = await bcrypt.hash(clave, 10);
        } else {
            clave = claveHash
        }

        // Convertir una cadena Base64 a MediumBlob
        if (foto) {
            foto = Buffer.from(foto, "base64");
        }

        // Construir el objeto para actualizar
        const usuarioEditado = {
            ...resto,
            clave: clave,
            foto: foto
        };

        // Construir la consulta de actualización
        const sql2 = "UPDATE usuarios SET ? WHERE id = ?";
        const reg2 = await pool.query(sql2, [usuarioEditado, id]);

        res.status(200).send(reg2);
    } catch (error) {
        console.error("Error al actualizar usuario: ", error);
        res.status(500).send("Error del servidor");
    }
};

// Cambiar clave de usuario
const changePasswordUser = async function (req, res) {
    try {
        const { correo, clave } = req.body

        // Encriptar la clave
        const claveHash = await bcrypt.hash(clave, 10);

        // Construir la consulta de cambio de clave
        const sql = "UPDATE usuarios SET clave = ? WHERE correo = ?";
        const reg = await pool.query(sql, [claveHash, correo]);

        res.status(200).send(reg);
    } catch (error) {
        console.error("Error al cambiar clave de usuario: ", error);
        res.status(500).send("Error del servidor");
    }
}

// Insertar usuario
const insertUser = async function (req, res) {
    try {
        // Desestructura clave y recoge el resto de los datos
        const { correo, clave, ...resto } = req.body;

        // Encriptar la clave
        const claveHash = await bcrypt.hash(clave, 10);

        // Construir el objeto para insertar
        const usuarioNuevo = {
            ...resto,
            correo: correo,
            clave: claveHash
        };

        // Consulta el correo electronico para verificar si existe
        const sql1 = "SELECT * FROM usuarios WHERE correo = ?";
        const reg1 = await pool.query(sql1, correo);
        if (reg1[0].length > 0) {
            return res.status(500).send("Error correo existente");
        }

        // Construir la consulta de inserción
        const sql2 = "INSERT INTO usuarios SET ?";
        const reg2 = await pool.query(sql2, usuarioNuevo);

        res.status(200).send(reg2);
    } catch (error) {
        console.error("Error al insertar usuario: ", error);
        res.status(500).send("Error del servidor");
    }
};

// Eliminar usuario
const deleteUser = async function (req, res) {
    try {
        const id = req.params.id

        // Construir la consulta de eliminación
        const sql = "DELETE FROM usuarios WHERE id = ?";
        const reg = await pool.query(sql, [id]);

        res.status(200).send(reg);
    } catch (error) {
        console.error("Error al eliminar usuario: ", error);
        res.status(500).send("Error del servidor");
    }
}

export {
    findUser,
    updateUser,
    changePasswordUser,
    insertUser,
    deleteUser
};