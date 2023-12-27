import patientData from '../../data/new_patients';
import { Patient, NonSensitivePatientData, NewPatient, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

let patients: Patient[] = patientData;

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
        ...new_object,
        entries: []
    };

    patients.push(newPatient);

    return newPatient;
};

const updatePatient = ( old_patient: Patient, new_entry: Entry): Patient => {
    const new_entries = old_patient.entries.concat(new_entry);

    const new_patient = {
        ...old_patient,
        entries: new_entries
    };

    return new_patient;
};

const addEntry = ( id: string, new_object: NewEntry ): Patient | undefined => {
    const newEntry = {
        id: uuid(),
        ...new_object
    };
    
    patients = patients.map(patient => (patient.id === id ? updatePatient(patient, newEntry) : patient));

    return findById(id);

};

const findById = ( id: string): Patient | undefined => {
    const found_patient = patients.find(pat => pat.id === id);
    return found_patient;
};

export default {
    getNonSensitivePatients,
    addPatient,
    findById,
    addEntry
};