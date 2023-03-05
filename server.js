import express from 'express'
import cors from 'cors'
import testimonialsRoute  from './routes/testimonialsRoutes.js'
import concertsRoute from './routes/concertsRoutes.js'
import seatsRoute from './routes/seatsRoutes.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api', testimonialsRoute)
app.use('/api', concertsRoute)
app.use('/api', seatsRoute)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});
// app.use((req, res) => {
//   res.status(404).send({ message: "Not found ..." })
// })

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});