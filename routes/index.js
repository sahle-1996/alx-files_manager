import express from 'express';
import { getStatus, getStats } from '../controllers/AppController';
import { postNew as createUser, getMe as getUserProfile } from '../controllers/UsersController';
import { getConnect as login, getDisconnect as logout } from '../controllers/AuthController';
import {
  postUpload as uploadFile,
  getShow as fetchFile,
  getIndex as listFiles,
  putPublish as publishFile,
  putUnpublish as unpublishFile,
  getFile as getFileContent,
} from '../controllers/FilesController';

function initializeRoutes(app) {
  const router = express.Router();
  app.use('/', router);

  // App Controller Routes
  router.get('/status', getStatus); // Check Redis and DB status
  router.get('/stats', getStats);   // Get user and file stats

  // Users Controller Routes
  router.post('/users', createUser);      // Add a new user to DB
  router.get('/users/me', getUserProfile); // Fetch user profile based on token

  // Auth Controller Routes
  router.get('/connect', login);   // Authenticate user and provide token
  router.get('/disconnect', logout); // Sign out user based on token

  // Files Controller Routes
  router.post('/files', uploadFile);                // Upload new file
  router.get('/files/:id', fetchFile);              // Fetch file by ID
  router.get('/files', listFiles);                  // List all files with pagination
  router.put('/files/:id/publish', publishFile);    // Mark file as public
  router.put('/files/:id/unpublish', unpublishFile);// Mark file as private
  router.get('/files/:id/data', getFileContent);    // Get file content by ID
}

export default initializeRoutes;
