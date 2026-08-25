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
        parent: `projects/clasificador-peces/locations/global`,
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
        const { searchedText, language } = req.query;

        // Traduce searchedText al idioma de language si se proporciona 
        const value = searchedText ? await translateArray([searchedText], language, "es") : null;
        // Consulta todas las especies si no hay texto de búsqueda
        let sql = "SELECT * FROM especies";
        let params = [];
        if (value && value.length > 0) {
            sql += " WHERE LOWER(tipo) LIKE LOWER(?) OR LOWER(nombreComun) LIKE LOWER(?) OR LOWER(nombreCientifico) LIKE LOWER(?)";
            params.push(`%${value[0]}%`);
            params.push(`%${value[0]}%`);
            params.push(`%${value[0]}%`);
        }
        sql += " ORDER BY nombreComun ASC";
        const [rows] = await pool.query(sql, params);

        if (rows.length === 0) {
            return res.status(404).send("Error no hay especies");
        }
        // Traducción de los campos de cada especie
        for (let i = 0; i < rows.length; i++) {
            const especie = rows[i];
            const values = [especie.nombreComun, especie.tipo, especie.habitatNatural, especie.dieta];
            const translatedValues = await translateArray(values, "es", language);
            rows[i] = {
                ...especie, // conserva otros campos
                nombreComun: translatedValues[0],
                tipo: translatedValues[1],
                habitatNatural: translatedValues[2],
                dieta: translatedValues[3],
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