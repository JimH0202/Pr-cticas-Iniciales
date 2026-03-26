const mysql = require('mysql2/promise');

async function addProfesorColumn() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'sql123!',
      database: 'universidad_app'
    });

    await connection.query(
      'ALTER TABLE cursos_aprobados ADD COLUMN profesor_nombre VARCHAR(255)'
    );

    console.log('✓ Columna profesor_nombre agregada correctamente');
    await connection.end();
  } catch (err) {
    if (err.message.includes('Duplicate column')) {
      console.log('✓ La columna ya existe');
    } else {
      console.error('Error:', err.message);
      process.exit(1);
    }
  }
}

addProfesorColumn();
