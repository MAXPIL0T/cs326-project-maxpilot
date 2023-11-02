// import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";
import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const credential = new DefaultAzureCredential();

class Database {  
    async connect() {
      // const accessToken = await credential.getToken('https://ossrdbms-aad.database.windows.net/.default');
      this.pool = new Pool({
        host: process.env.AZURE_POSTGRESQL_HOST,
        user: process.env.AZURE_POSTGRESQL_USER,
        // password: accesstoken.token,
        password: process.env.AZURE_POSTGRESQL_PASSWORD,
        database: process.env.AZURE_POSTGRESQL_DATABASE,
        port: Number(process.env.AZURE_POSTGRESQL_PORT) ,
        ssl: process.env.AZURE_POSTGRESQL_SSL
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
          pwd varchar(30),
          filenames text[]
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

    async addFile(name, file) {
      const files = await this.getFileNames(name);
      let ret = files.rows[0].filenames === null ? [] : files.rows[0].filenames
      if (!ret.includes(file)) {
        const queryText = 'UPDATE users SET filenames = array_append(filenames, ($1)) WHERE name=($2)';
        await this.client.query(queryText, [file, name]);
      }
    }

    async getFileNames(name) {
      const queryText = 'SELECT filenames FROM users WHERE name=($1)';
      return await this.client.query(queryText, [name]);
    }

    async deleteFile(file, name) {
      const queryText = 'UPDATE users SET filenames = array_remove(filenames, ($1)) WHERE name=($2)'
      await this.client.query(queryText, [file, name]);
    }
  }
  
  const database = new Database();
  await database.connect();
  
  export default database;
