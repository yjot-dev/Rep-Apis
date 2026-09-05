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

// Seleccionar especies
const seleccionar_especies = async function (req, res) {
    try {
        const { language } = req.query;

        // Consulta todas las especies
        const sql = "SELECT * FROM especies ORDER BY nombreComun ASC";
        const [rows] = await pool.query(sql);

        if (rows.length === 0) {
            return res.status(404).send("Error no hay especies");
        }
        // Traducción de los campos de cada especie
        for (let i = 0; i < rows.length; i++) {
            const especie = rows[i];
            const values = [especie.nombreComun, especie.zonaDeCultivo, especie.enfermedad];
            const translatedValues = await translateArray(values, "es", language);
            rows[i] = {
                ...especie, // conserva otros campos
                nombreComun: translatedValues[0],
                zonaDeCultivo: translatedValues[1],
                enfermedad: translatedValues[2]
            };
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