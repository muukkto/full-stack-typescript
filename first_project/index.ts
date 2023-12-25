import express from 'express';
import { isNumber } from './utils';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const parameters = req.query;

    let message = {};

    if (parameters.height && parameters.weight) {
        const height = parameters.height;
        const weight = parameters.weight;
        if (isNumber(height) && isNumber(weight)) {
            const result = calculateBmi(Number(height), Number(weight));
            message = {weight: weight, height: height , bmi: result};
        } else {
            message = {error: "malformatted parameters"};
        }
    } else {
        message = {error: "malformatted parameters"};
    }

    res.send(message);
});

app.post("/exercises", (req, res) => {
    const {daily_exercises, target} = req.body;
    let message = {};

    if (daily_exercises && target) {
        if (isNumber(target) && Array.isArray(daily_exercises)) {
            if (daily_exercises.length === daily_exercises.filter(day => isNumber(day)).length) {
                const result = calculateExercises(daily_exercises as number[], target as number);
                message = result;
            } else {
                message = {error: "malformatted parameters"};
            }
        } else {
            message = {error: "malformatted parameters"};
        }
    } else {
        message = {error: "parameters missing"};
    }

    res.send(message);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});