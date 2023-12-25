import { isNumber } from "./utils";

interface Arguments {
    value1: number
    value2: number
}

const parseArguments = (args: string[]) : Arguments => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (isNumber(args[2]) && isNumber(args[3])) {
        const result = { value1: Number(args[2]), value2: Number(args[3])};

        return result;

      } else {
        throw new Error('Provided values were not numbers!');
      }
};

export const calculateBmi = (height: number, weight: number) : string => {

    const bmi = weight / (height/100)**2;

    if (bmi < 16) {
        return "Underweight (severe)";
    } else if (bmi < 17) {
        return "Underweight (moderate)";
    } else if (bmi < 18.5) {
        return "Underweight (mild)";
    } else if (bmi < 25) {
        return "Normal (healthy weight)";
    } else if (bmi < 30) {
        return "Overweight (pre-obese)";
    } else if (bmi < 35) {
        return "Obesity (moderate)";
    } else if (bmi < 40) {
        return "Obesity (difficult)";
    } else {
        return "Obesity (severe)";
    }
};

try {
    const { value1, value2 } = parseArguments(process.argv);
    console.log(calculateBmi(value1, value2));

} catch (error: unknown) {
    let errorMessage = 'An Error occured.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}