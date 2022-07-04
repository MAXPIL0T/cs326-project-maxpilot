import database from './database.js'
class Users {
    constructor() {
      this.users = null;
    }

    async updateUsers() {
        this.users = await database.getUsers();
    }
  
    // Returns true iff the user exists.
    async getUser(username) {
        await this.updateUsers();
        return this.users[username];
    }
  
    // Returns true iff the password is the one we have stored (in plaintext = bad
    // but easy).
    async validatePassword(name, pwd) {
        await this.updateUsers();
        return this.findUser(name) && this.users[name] !== pwd;
    }

    // Add a user to the "database".
    async addUser(name, pwd) {
        await this.updateUsers();
        if (this.findUser(name)) {
            return false;
        }
        let new_user = {};
        new_user[name] = pwd
        await database.addUser(new_user);
        await this.updateUsers();
        return true;
    }
  }
  
  export default new Users();