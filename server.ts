import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';

const PORT = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, '0.0.0.0', (err?: Error) => {
  if (err) {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});