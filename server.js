import express from 'express';
import setupRoutes from './routes/index';

/**
 * Backend project summary:
 * - Authentication using tokens
 * - Integration with NodeJS, MongoDB, and Redis
 * - Pagination and background processing
 * - Core functionalities include:
 *   - User authentication
 *   - Listing files
 *   - Uploading files
 *   - Modifying file permissions
 *   - Viewing files
 *   - Generating image thumbnails
 */

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Initialize all application routes
setupRoutes(app);

// Start the server
app.listen(port, () => {
  console.log(`Express server is up and running on port ${port}`);
});

export default app;
