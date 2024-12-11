import pg from 'pg';
import 'dotenv/config'

const passwordDB  = process.env.DB_PASSWORD
const db = new pg.Client({
  user: process.env.DB_USER,
  password: passwordDB, // Ensure string type
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10), // Convert port to number
});

async function connectDB() {
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
  console.log("DB_DATABASE:", process.env.DB_DATABASE);
  console.log("DB_PORT:", process.env.DB_PORT);
  console.log("Password type:", typeof process.env.DB_PASSWORD);
  console.log("Port type:", typeof process.env.DB_PORT);

  try {
    await db.connect();
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error("Error connecting to the database:", err.stack);
  }
}

connectDB();

export default db;
