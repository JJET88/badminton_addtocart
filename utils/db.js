import mysql from "mysql2/promise";

// ✅ Use mysql.createPool() from mysql2/promise directly
// This already returns a promise-based pool
export const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'u6704798',
  password: '6704798',
  database: 'badminton_pos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});