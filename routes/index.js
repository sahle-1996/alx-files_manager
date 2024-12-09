import { Router } from 'express';

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import UtilController from '../controllers/UtilController';

const apiRouter = Router();

apiRouter.use((req, res, next) => {
  const authPaths = ['/connect'];
  if (!authPaths.includes(req.path)) {
    next();
  } else if (!req.headers.authorization) {
    res.status(401).json({ error: 'Unauthorized' }).end();
  } else {
    next();
  }
});

apiRouter.use((req, res, next) => {
  const tokenPaths = ['/disconnect', '/users/me', '/files'];
  if (!tokenPaths.includes(req.path)) {
    next();
  } else if (!req.headers['x-token']) {
    res.status(401).json({ error: 'Unauthorized' }).end();
  } else {
    next();
  }
});

apiRouter.get('/status', AppController.getStatus);
apiRouter.get('/stats', AppController.getStats);
apiRouter.post('/users', UsersController.postNew);
apiRouter.get('/connect', AuthController.getConnect);
apiRouter.get('/disconnect', AuthController.getDisconnect);
apiRouter.post('/files', FilesController.postUpload);
apiRouter.get('/files/:id', FilesController.getShow);
apiRouter.get('/files', FilesController.getIndex);

apiRouter.put('/files/:id/publish', UtilController.token, FilesController.putPublish);
apiRouter.put('/files/:id/unpublish', UtilController.token, FilesController.putUnpublish);

export default apiRouter;
