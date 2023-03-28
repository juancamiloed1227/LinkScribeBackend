import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import linkRoutes from './routes/linkRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import listRoutes from './routes/listRoutes.js';
import { sequelize } from './config/database.js';
import * as dotenv from 'dotenv';

dotenv.config()

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/links', linkRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error(`Error syncing with database: ${error}`);
  });
