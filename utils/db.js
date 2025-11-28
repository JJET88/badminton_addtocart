const mysql = require('mysql2')
export const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'u6704798',
    password: '6704798',
    database: 'badminton_pos'
})