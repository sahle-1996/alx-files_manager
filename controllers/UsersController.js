import Utility from './UtilController';
import dbClient from '../utils/db';

export default class UsersController {
  static async createUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      const missingField = !email ? 'email' : 'password';
      res.status(400).json({ error: `Missing ${missingField}` }).end();
    } else if (await dbClient.userExists(email)) {
      res.status(400).json({ error: 'Already exists' }).end();
    } else {
      try {
        const hashedPassword = Utility.SHA1(password);
        const result = await dbClient.newUser(email, hashedPassword);
        const { _id, email: newEmail } = result.ops[0];
        res.status(201).json({ id: _id, email: newEmail }).end();
      } catch (error) {
        res.status(400).json({ error: error.message }).end();
      }
    }
  }

  static async fetchUser(req, res) {
    const { usr } = req;
    const user = { ...usr, id: usr._id };
    delete user._id;
    delete user.password;
    res.status(200).json(user).end();
  }
}
