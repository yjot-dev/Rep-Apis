import mysql from "mysql2/promise";

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config({ path: "./src/bd/.env" });
}

const dataConexion = {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

const pool = mysql.createPool(dataConexion)

export default pool;