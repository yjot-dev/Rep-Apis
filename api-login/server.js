// Instanciar rutas
import { api } from './src/routes/userRoute.js';

// Instanciar modulos
import express from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';
const app = express()

// Configurar puerto
app.set('port', process.env.PORT || 443)

// Usar JSON
app.use(express.json())

// Usar rutas
app.use('/api', api)

// Lee el certificado y la clave privada
const privateKey = readFileSync('./src/certificate/mykey.key');
const certificate = readFileSync('./src/certificate/mycert.crt');
const credentials = { key: privateKey, cert: certificate };

// Crea el servidor HTTPS
const httpsServer = createServer(credentials, app);

// Escuchar servicio
httpsServer.listen(app.get('port'), (error) => {
    if (error) {
        console.log(`Sucedió un error: ${error}`);
    }else{
        console.log(`Servidor corriendo en el puerto: ${app.get('port')}`);
    }
});