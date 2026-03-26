const mysql = require('mysql2/promise');

async function seedData() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'sql123!',
      database: 'universidad_app'
    });

    // Insertar profesores
    const profesores = [
      { nombres: 'Carlos', apellidos: 'López García' },
      { nombres: 'María', apellidos: 'González Rodríguez' },
      { nombres: 'Juan', apellidos: 'Martínez Pérez' },
      { nombres: 'Ana', apellidos: 'Rodríguez Silva' }
    ];

    for (const prof of profesores) {
      await connection.query(
        'INSERT IGNORE INTO profesores (nombres, apellidos) VALUES (?, ?)',
        [prof.nombres, prof.apellidos]
      );
    }

    console.log('✓ Profesores insertados');

    // Insertar cursos
    const cursos = [
      { nombre: 'Matemáticas Avanzadas', codigo: 'MAT-401' },
      { nombre: 'Programación en Java', codigo: 'CS-301' },
      { nombre: 'Bases de Datos', codigo: 'CS-205' },
      { nombre: 'Algoritmos', codigo: 'CS-202' },
      { nombre: 'Desarrollo Web', codigo: 'CS-401' },
      { nombre: 'Física Cuántica', codigo: 'PHYS-301' }
    ];

    for (const curso of cursos) {
      await connection.query(
        'INSERT IGNORE INTO cursos (nombre, codigo) VALUES (?, ?)',
        [curso.nombre, curso.codigo]
      );
    }

    console.log('✓ Cursos insertados');

    await connection.end();
    console.log('\n✓✓✓ Base de datos poblada correctamente');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedData();
