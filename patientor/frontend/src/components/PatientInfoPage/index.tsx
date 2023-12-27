import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Typography, Box, Button, Alert } from "@mui/material";
import { FemaleRounded, MaleRounded, TransgenderRounded } from "@mui/icons-material";

import { EntryFormValues, Patient } from "../../types";

import { EntryList } from "./EntriesList";
import { EntryEditor } from "../EntryEditor";
import patientService from "../../services/patients";
import axios from "axios";

const OnePatientPage = () => {
    const id = useParams().id;
    const [ patient, setPatient] = useState<Patient>();
    const [entryEditorOpen, setEntryEditorOpen] = useState<boolean>(false);

    const [errorShow, setErrorShow] = useState(false);
    const [error, setError] = useState<string>();

    if (!id) {
        return (<div>Patient not found</div>);
    }

    const handleError = (message: string) => {
        setError(message);
        setErrorShow(true);

        setTimeout(() => {
            setErrorShow(false);
            setError("");
        }, 5000);
    };

    const onEntrySubmit = async (entry_values: EntryFormValues) => {
        try {
            const modified_patient = await patientService.createEntry(entry_values, id);
            setPatient(modified_patient);
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (e?.response?.data && typeof e?.response?.data === "string") {
                  const message = e.response.data.replace('Something went wrong. Error: ', '');
                  console.error(message);
                  handleError(message);
                } else {
                  handleError("Unrecognized axios error");
                }
            } else {
                console.error("Unknown error", e);
                handleError("Unknown error");
            }
        }
    };


    useEffect(() => {
        const fetchPatient = async () => {
            const patient_object = await patientService.getOne(id);
            setPatient(patient_object);
        };
        void fetchPatient();
    }, []);

    const icon = () => {
        switch (patient?.gender) {
            case "male":
                return <MaleRounded />;
            case "female":
                return <FemaleRounded />;
            case "other":
                return <TransgenderRounded />;
        }
    };

    const openEntryEditor = () => setEntryEditorOpen(true);

    const closeEntryEditor = () => setEntryEditorOpen(false);

    return (
        <Box style={{ marginTop: "2em" }}>
            <Typography variant="h5" style={{ marginBottom: "0.5em" }}>{patient?.name}{icon()}</Typography>
            <Typography variant="body1">ssn: {patient?.ssn}</Typography>
            <Typography variant="body1">occupation: {patient?.occupation}</Typography>
            {errorShow ? <Alert severity="error">{error}</Alert> : null}
            {entryEditorOpen 
            ? <EntryEditor onClose={closeEntryEditor} onSubmit={onEntrySubmit} />
            : <Button variant="contained" onClick={() => openEntryEditor()}>Add new entry</Button>}
            {patient?.entries && <EntryList entries={patient.entries}/>}
        </Box>
    );
};

export default OnePatientPage;