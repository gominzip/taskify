import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("◌ ｡˚✩ 가상머신 MySQL 접속 성공 ✩˚ ｡◌");

    const [rows] = await connection.query("SELECT VERSION() AS version");
    console.log("DB 버전:", rows[0].version);

    connection.release();
  } catch (error) {
    console.error("DB 연결 중 에러:", error.message);
  }
}
