// import pg from 'pg';
// import pkg from 'pg';  
// const db = new pg.Client({
//     user: "postgres",
//     password: "Atulyadav31",
//     database: "User",
//     port: 5432,
//   });
// ConfigDB/ConnectDB.js
import pgPromise from 'pg-promise';  // Import pg-promise
const pgp = pgPromise();            // Initialize pg-promise

// Database connection configuration
const db = pgp({
  user: "postgres",                 // Your username
  password: "Atulyadav31",          // Your password
  database: "User",                 // Your database name
  host: "localhost",                // Database host
  port: 5432,                       // PostgreSQL default port
});




  db.connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));
export default db