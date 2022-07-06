import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

class Database {
    constructor(dburl) {
      this.dburl = dburl;
    }
  
    async connect() {
      this.pool = new Pool({
        connectionString: this.dburl,
        ssl: { rejectUnauthorized: false }, // Required for Heroku connections
      });
  
      // Create the pool.
      try {
        this.client = await this.pool.connect();
      } catch (error) {
        console.log(error);
      }
  
      // Init the database.
      await this.init();
    }
  
    async init() {
      const queryText = `
        create table if not exists users (
          name varchar(30) primary key,
          pwd varchar(30)
        );
      `;
      const res = await this.client.query(queryText);
    }

    async getUsers() {
        const queryText = 'SELECT * FROM users';
        const res = await this.client.query(queryText);
        return res.rows;
    }

    async addUser(name, pwd) {
        const queryText = 'INSERT INTO users (name, pwd) VALUES ($1, $2) RETURNING *';
        await this.client.query(queryText, [name, pwd]);
    }
  }
  
  const database = new Database(process.env.DATABASE_URL);
  await database.connect();
  
  export default database;