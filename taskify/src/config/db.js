import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "192.168.64.3",
  user: "myuser",
  password: "mypassword",
  database: "taskify",
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
