const mysql = require('mysql2/promise');
const fs = require('fs');

async function setupDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'sql123!',
      multipleStatements: true
    });
    
    const sql = fs.readFileSync('./setup.sql', 'utf8');
    
    // Ejecutar todo el SQL de una vez
    const [results] = await connection.query(sql);
    
    await connection.end();
    console.log('✓ Base de datos creada correctamente');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

setupDB();
