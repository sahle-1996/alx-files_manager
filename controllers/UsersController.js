import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

function setupRoutes(app) {
  const router = Router();
  app.use('/', router);

  // Health Check Endpoints
  router.get('/status', AppController.getStatus); // Redis and DB health check
  router.get('/stats', AppController.getStats);   // Retrieve statistics

  // User Management Endpoints
  router.post('/users', UsersController.postNew); // Register a new user
  router.get('/users/me', UsersController.getMe); // Get authenticated user details

  // Authentication Endpoints
  router.get('/connect', AuthController.getConnect);   // User login
  router.get('/disconnect', AuthController.getDisconnect); // User logout

  // File Operations Endpoints
  router.post('/files', FilesController.postUpload);                // Upload file
  router.get('/files/:id', FilesController.getShow);                // Retrieve file by ID
  router.get('/files', FilesController.getIndex);                   // List all files with pagination
  router.put('/files/:id/publish', FilesController.putPublish);     // Make file public
  router.put('/files/:id/unpublish', FilesController.putUnpublish); // Make file private
  router.get('/files/:id/data', FilesController.getFile);           // Get file content by ID
}

export default setupRoutes;
