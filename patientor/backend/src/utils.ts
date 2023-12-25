import { NewPatient, Gender } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isGender = (text: string): text is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(text);
};

const parseString = (string: unknown): string => {
  if (!isString(string)) {
    throw new Error('Incorrect or missing value');
  }

  return string;
};

const parseGender = (string: unknown): Gender => {
  if (!isString(string) || !isGender(string)) {
    throw new Error('Incorrect or missing gender');
  }

  return string;
};

const toNewPatient = (object: unknown): NewPatient => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('gender' in object && 'dateOfBirth' in object && 'ssn' in object && 'name' in object && 'occupation' in object) {

  const newPatient: NewPatient = {
    name: parseString(object.name),
    dateOfBirth: parseString(object.dateOfBirth),
    ssn: parseString(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation)
  };

  return newPatient;

  }
  
  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatient;