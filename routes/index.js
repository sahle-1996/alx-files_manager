import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

function initializeRoutes(app) {
  const router = express.Router();
  app.use('/', router);

  // Application Controller Endpoints

  // Returns Redis and DB connection status
  router.get('/status', AppController.getStatus);

  // Returns the count of users and files in the database
  router.get('/stats', AppController.getStats);

  // User Controller Endpoints

  // Creates a new user in the database
  router.post('/users', UsersController.postNew);

  // Retrieves the currently authenticated user
  router.get('/users/me', UsersController.getMe);

  // Authentication Controller Endpoints

  // Logs in the user and provides an authentication token
  router.get('/connect', AuthController.getConnect);

  // Logs out the user based on the provided token
  router.get('/disconnect', AuthController.getDisconnect);

  // File Controller Endpoints

  // Uploads a new file to the database and storage
  router.post('/files', FilesController.postUpload);

  // Retrieves file metadata by ID
  router.get('/files/:id', FilesController.getShow);

  // Lists all files for a specific user with pagination
  router.get('/files', FilesController.getIndex);

  // Publishes a file by setting its isPublic attribute to true
  router.put('/files/:id/publish', FilesController.putPublish);

  // Unpublishes a file by setting its isPublic attribute to false
  router.put('/files/:id/unpublish', FilesController.putUnpublish);

  // Retrieves the content of a file by ID
  router.get('/files/:id/data', FilesController.getFile);
}

export default initializeRoutes;
