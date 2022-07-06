import database from './database.js'
class Users {
    constructor() {
      this.users = null;
    }

    async findUser(username) {
        await this.updateUsers();
        if (!this.users.find(x => x.name === username)) {
            return false;
        } else {
            return true;
        }
    }

    async updateUsers() {
        this.users = await database.getUsers();
    }
  
    // Returns true iff the user exists.
    async getUser(username) {
        await this.updateUsers();
        return this.users.find(x => x.name === username);
    }
  
    // Returns true iff the password is the one we have stored (in plaintext = bad
    // but easy).
    async validatePassword(name, pwd) {
        await this.updateUsers();
        return await this.findUser(name) && this.users.find(x => x.name === name).pwd === pwd;
    }

    // Add a user to the "database".
    async addUser(name, pwd) {
        await this.updateUsers();
        if (await this.findUser(name)) {
            return false;
        }
        await database.addUser(name, pwd);
        await this.updateUsers();
        return true;
    }
  }
  
  export default new Users();