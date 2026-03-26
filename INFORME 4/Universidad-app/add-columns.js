const mysql = require('mysql2/promise');

async function addColumns() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'sql123!',
      database: 'universidad_app'
    });

    await connection.query(
      'ALTER TABLE publicaciones ADD COLUMN curso_nombre_text VARCHAR(255), ADD COLUMN profesor_nombre_text VARCHAR(255)'
    );

    console.log('✓ Columnas agregadas correctamente');
    await connection.end();
  } catch (err) {
    if (err.message.includes('Duplicate column')) {
      console.log('✓ Las columnas ya existen');
    } else {
      console.error('Error:', err.message);
      process.exit(1);
    }
  }
}

addColumns();
