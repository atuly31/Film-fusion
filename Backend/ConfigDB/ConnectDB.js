import pg from 'pg';
import pkg from 'pg';  
const { Client } = pkg;
const db = new pg.Client({
    user: "postgres",
    password: "Atulyadav31",
    database: "User",
    port: 5432,
  });

export default db