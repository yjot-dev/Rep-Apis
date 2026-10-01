import pool from "../bd/db.js";
import { TranslationServiceClient } from '@google-cloud/translate';

const credentials = JSON.parse(process.env.CLOUD_TRANSLATION_API);
const translateClient = new TranslationServiceClient({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    },
    projectId: credentials.project_id
});

/**
 * Traduce un texto desde español a otro idioma usando Google Cloud Translation API.
 * Si el idioma solicitado es "es" (español), devuelve el texto original sin traducir.
 *
 * @param {string[]} values - Arreglo de textos en español que se desean traducir.
 * @param {string} [targetLang="es"] - Código ISO del idioma destino (ej. "en", "fr", "de").
 * @returns {Promise<string[]>} Promesa que resuelve en un arreglo con los textos traducidos.
 */
async function translateArray(values, sourceLang = "es", targetLang = "es") {
    // Si el idioma de origen y destino es español, no traducir
    if (sourceLang === "es" && targetLang === "es") {
        return values;
    }

    // Configuración de la petición
    const request = {
        parent: `projects/clasificador-banana/locations/global`,
        contents: values,
        mimeType: "text/plain",
        sourceLanguageCode: sourceLang,
        targetLanguageCode: targetLang,
    };

    try {
        const [response] = await translateClient.translateText(request);
        return response.translations.map(t => t.translatedText);
    } catch (error) {
        console.error("Error en la traducción:", error);
        throw error;
    }
}

// Seleccionar variedades
const seleccionar_variedades = async function (req, res) {
    try {
        const { language } = req.query;

        // Consulta todas las variedades
        const sql = "SELECT * FROM variedades_banano ORDER BY nombre ASC";
        const [rows] = await pool.query(sql);

        if (rows.length === 0) {
            return res.status(404).send("Error no hay variedades");
        }
        // Traducción de los campos de cada variedad
        for (let i = 0; i < rows.length; i++) {
            const variedad = rows[i];
            const values = [variedad.nombre, variedad.resistencia, variedad.origen];
            const translatedValues = await translateArray(values, "es", language);
            rows[i] = {
                ...variedad, // conserva otros campos
                nombre: translatedValues[0],
                resistencia: translatedValues[1],
                origen: translatedValues[2]
            };
        }
        res.status(200).send(rows);
    } catch (error) {
        console.error("Error al consultar variedades: ", error);
        res.status(500).send("Error del servidor");
    }
};

export {
    seleccionar_variedades
};