import diagnosesData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const diagnoses: Diagnosis[] = diagnosesData;

const getEntries = () => {
  return diagnoses;
};

export default {
  getEntries
};