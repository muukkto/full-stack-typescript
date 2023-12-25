import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

import diagnosesRouter from './routes/diagnosisRouter';
import patientRouter from './routes/patientRouter';

const PORT = 3000;

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);

app.use('/api/patients', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});