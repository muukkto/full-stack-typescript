import patientData from '../../data/patients';
import { Patient, NonSensitivePatientData, NewPatient } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getNonSensitivePatients = (): NonSensitivePatientData[] => {
    return patients.map(({id, name, dateOfBirth, gender, occupation}) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation}));
};

const addPatient = ( new_object: NewPatient): Patient => {
    const newPatient = {
        id: uuid(),
        ...new_object
    };

    patients.push(newPatient);

    return newPatient;
};

export default {
    getNonSensitivePatients,
    addPatient
};