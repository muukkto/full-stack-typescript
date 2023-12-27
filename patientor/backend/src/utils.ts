import { NewPatient, NewEntry, Gender, Diagnosis, HealthCheckRating, Discharge, SickLeave } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (text: unknown): text is number => {
  return typeof text === 'number' || text instanceof Number;
};

const isGender = (text: string): text is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(text);
};

const isHealthCheckRating = (int: number): int is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(int);
};

const parseString = (string: unknown): string => {
  if (!isString(string) || string.length == 0) {
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

const parseHealthCheckRating = (int: unknown): HealthCheckRating => {
  if (!isNumber(int) || !isHealthCheckRating(int)) {
    throw new Error('Incorrect or missing health check rating');
  }

  return int;
};

const parseDischarge = (object: unknown): Discharge => {
  if ( object && typeof object == 'object' && 'date' in object && 'criteria' in object) {
    if (object.date && object.criteria) {
      return {
        date: parseString(object.date),
        criteria: parseString(object.criteria)
      };
    } else {
      return { date: "", criteria: ""};
    }
  }

  throw new Error('Incorrect discharge');
};

const parseSickLeave = (object: unknown): SickLeave => {
  if ( object && typeof object == 'object' && 'startDate' in object && 'endDate' in object) {
    if (object.startDate && object.endDate) {
      return {
        startDate: parseString(object.startDate),
        endDate: parseString(object.endDate)
      };
    } else {
      return { startDate: "", endDate: "" };
    }
  }

  throw new Error('Incorrect sick leave');  

};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object') {
    return [] as Array<Diagnosis['code']>;
  }

  return object as Array<Diagnosis['code']>;
};

export const toNewPatient = (object: unknown): NewPatient => {
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

export const toNewEntry = (object: unknown): NewEntry => {
  if ( !object || typeof object !== "object" ) {
    throw new Error('Incorrect or missing data');
  }

  if ('type' in object && 'date' in object && 'specialist' in object && 'description' in object) {
    let basicNewEntry = {
      description: parseString(object.description),
      date: parseString(object.date),
      specialist: parseString(object.specialist)
    };

    if ('diagnosisCodes' in object) {
      const entryWithDiagnoses = {
        ...basicNewEntry,
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
      };
      basicNewEntry = entryWithDiagnoses;
    }

    if (object.type === "HealthCheck") {
      if ('healthCheckRating' in object){
        const healtEntry = {
          ...basicNewEntry,
          type: <const> "HealthCheck",
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
        };
        return healtEntry;
      }
    } else if (object.type === "Hospital") {
      if ('discharge' in object) {
        const entryWithDischarge = {
          ...basicNewEntry,
          discharge: parseDischarge(object.discharge)
        };
        basicNewEntry = entryWithDischarge;
      }

      const hospitalEntry = {
        ...basicNewEntry,
        type: <const> "Hospital"
      };

      return hospitalEntry;

    } else if (object.type === "OccupationalHealthcare") {
      if ('sickLeave' in object) {
        const entryWithLeave = {
          ...basicNewEntry,
          sickLeave: parseSickLeave(object.sickLeave)
        };
        basicNewEntry = entryWithLeave;
      }

      if ('employerName' in object) {
        const occupationalEntry = {
          ...basicNewEntry,
          employerName: parseString(object.employerName),
          type: <const> "OccupationalHealthcare",
        };
  
        return occupationalEntry;
      }

    } else {
      throw new Error('Incorrect data: unknown type of entry');
    }
  }

  throw new Error('Incorrect data: some fields are missing');
};