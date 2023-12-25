import { isNumber } from "./utils";

interface Result {
    periodLength: number
    trainingDays: number
    success: boolean
    rating: number
    ratingDescription: string
    target: number
    average: number
}

interface Arguments {
    value: number
    array: number[]
}

const parseArguments = (args: string[]) : Arguments => {
    if (args.length < 4) throw new Error('Not enough arguments');

    let target = 0;

    if (isNumber(args[2])) {
        target = Number(args[2]);
    } else {
        throw new Error('Provided values were not numbers!');
    }

    args.splice(0, 3);

    const array = [];

    for (const argument of args) {
        if (isNumber(argument)) {
            array.push(Number(argument));
        } else {
            throw new Error('Provided values were not numbers!');
        }
    }

    const result = { value: target, array: array};
    return result;
};

export const calculateExercises = ( exercises: number[], target: number ) : Result => {
    const period_length = exercises.length;
    const training_days = exercises.filter(day => day > 0).length;

    let sum = 0;
    exercises.map(day => sum = sum + day);
    const aver = sum / period_length;

    let success = false;
    let rating = 0;
    let rating_description = "";

    if (aver >= target) {
        success = true;
        rating = 3;
        rating_description = "magnificent, you achieved your target";
    } else if (aver >= target*0.5) {
        rating = 2;
        rating_description = "not too bad but could be better";
    } else {
        rating = 1;
        rating_description = "there is still much to do";
    }

    const result = { periodLength: period_length, 
                     trainingDays: training_days,
                     average: aver,
                     target: target,
                     rating: rating,
                     ratingDescription: rating_description,
                     success: success};

    return result;
};

try {
    const { value, array } = parseArguments(process.argv);
    console.log(calculateExercises(array, value));

} catch (error: unknown) {
    let errorMessage = 'An Error occured.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}