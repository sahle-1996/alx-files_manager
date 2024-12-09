import { Buffer } from 'buffer';
import { v4 as uuid } from 'uuid';
import redisClient from '../utils/redis';
import Utility from './UtilController';
import dbClient from '../utils/db';

export default class AuthController {
  static async connectUser(req, res) {
    try {
      const [type, credentials] = req.headers.authorization.split(' ');
      const [email, password] = Buffer.from(credentials, 'base64').toString().split(':');
      const hashedPassword = Utility.SHA1(password);
      const user = await dbClient.filterUser({ email });

      if (!user || user.password !== hashedPassword) {
        res.status(401).json({ error: 'Unauthorized' }).end();
      } else {
        const authToken = uuid();
        await redisClient.set(`auth_${authToken}`, user._id.toString(), 86400);
        res.status(200).json({ token: authToken }).end();
      }
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' }).end();
    }
  }

  static async disconnectUser(req, res) {
    const { token } = req;
    await redisClient.del(`auth_${token}`);
    res.status(204).end();
  }
}
