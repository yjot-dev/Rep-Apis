// Obtener coordenadas con Geocoding API
const obtener_coordenadas = async function (req, res) {
    try {
        // Recibir parámetros desde el body
        const { pais, provincia, ciudad } = req.query;
        console.log("Entrada:", { pais, provincia, ciudad });

        // Llamar a la API de Geocoding
        const params = new URLSearchParams({
            address: `${ciudad}, ${provincia}, ${pais}`,
            key: process.env.GEOCODING_API_KEY
        });

        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
        const reg = await response.json();

        // Validar respuesta
        if (reg.status !== "OK" || reg.results.length === 0) {
            return res.status(404).send("Ubicación no encontrada");
        }

        // Extraer coordenadas
        const location = reg.results[0].geometry.location;
        const coordenadas = {
            latitude: location.lat,
            longitude: location.lng,
        };

        console.log("Salida:", coordenadas);
        res.status(200).json(coordenadas);
    } catch (error) {
        console.error("Error al obtener coordenadas:", error);
        res.status(500).send("Error del servidor");
    }
};

export { obtener_coordenadas };