import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import fs from 'fs';

// Constantes
const INPUT_SIZE = 224;
const LABELS = ['Demasiado maduro', 'Maduro', 'Podrido', 'Verde'];

let model = null;

// Función auxiliar para cargar modelo una sola vez
const loadModelIfNeeded = async function () {
    if (!model) {
        model = await tf.loadGraphModel('file://./models/model.json');
    }
    return model;
};

// Función auxiliar para parsear base64
const parseBase64Image = function (dataString) {
    try {
        const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) return null;
        return Buffer.from(matches[2], 'base64');
    } catch {
        return null;
    }
};

// Método principal de inferencia
const inferir_banana = async function (req, res) {
    try {
        // Acepta: base64 en JSON body
        const { image } = req.body;
        if (!image) {
            return res.status(400).send("Error: campo 'image' requerido en el body");
        }

        const imgBuffer = parseBase64Image(image);
        if (!imgBuffer) {
            return res.status(400).send("Error: imagen base64 inválida");
        }

        // Normalizar/resizer con sharp -> PNG buffer
        const resizedBuffer = await sharp(imgBuffer)
            .resize(INPUT_SIZE, INPUT_SIZE, { fit: 'cover' })
            .removeAlpha()
            .png()
            .toBuffer();

        // Crear tensor directamente con tf.node.decodeImage
        const imgTensor = tf.node.decodeImage(resizedBuffer, 3)
            .toFloat()
            .div(255.0)
            .expandDims(0);

        const mdl = await loadModelIfNeeded();
        let preds = mdl.predict(imgTensor);

        // La variable preds puede ser tensor o arreglo
        if (Array.isArray(preds)) preds = preds[0];
        let scores = preds;
        if (scores.shape.length === 2 && scores.shape[0] === 1) {
            scores = tf.squeeze(scores);
        }
        const scoresData = await tf.softmax(scores).data();

        // Ordenar resultados
        const scoresArr = Array.from(scoresData);
        const resultados = LABELS.map((label, i) => ({
            label,
            score: scoresArr[i]
        })).sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

        // Limpiar tensores
        tf.dispose([imgTensor, preds, scores]);

        return res.status(200).json(resultados);
    } catch (error) {
        console.error("Error en inferencia:", error);
        return res.status(500).send("Error del servidor en inferencia");
    }
};

export { inferir_banana };