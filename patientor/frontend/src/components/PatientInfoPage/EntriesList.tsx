import { Box, List, ListItem, Typography } from "@mui/material";
import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckRating } from "../../types";
import { LocalHospitalRounded, WorkRounded, MonitorHeartRounded, FavoriteRounded, HeartBrokenRounded } from "@mui/icons-material";
import { red, lightGreen, yellow } from "@mui/material/colors";
import diagnosisService from "../../services/diagnoses";
import { useEffect, useState } from "react";

export const EntryList = ({entries}: {entries: Entry[]}) => {

    const [ diagnoses, setDiagnoses] = useState<Diagnosis[]>();

    const assertNever = (value: never): never => {
        throw new Error(
          `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
      };

    useEffect(() => {
        const fetchDiagnoses = async () => {
            const diagnoses_array = await diagnosisService.getAll();
            setDiagnoses(diagnoses_array);
        };
        void fetchDiagnoses();
    }, []);

    const DiagnosesList = ({entry_diagnoses}: {entry_diagnoses: string[]}) => {
        return (
            <List>
                {entry_diagnoses.map(code => <ListItem key={code}>{code} {diagnoses?.find(diagnosis => diagnosis.code === code)?.name}</ListItem>)}
            </List>
        );
    };

    const HealthCheckRatingIcon = ({rating}: {rating: HealthCheckRating}) => {
        switch (rating) {
            case 0:
                return <FavoriteRounded sx={{ color: lightGreen["A400"] }} />;
            case 1:
                return <FavoriteRounded sx={{ color: yellow[500] }} />;
            case 2:
                return <FavoriteRounded sx={{ color: red[500] }} />;
            case 3:
                return <HeartBrokenRounded sx={{ color: red[500] }} />;
        }

    };

    const HealthCheck = ({entry}: {entry: HealthCheckEntry}) => {
        return (
            <Box sx={{ border: 1, borderRadius: 2, marginTop: "0.5em", padding: "0.5em" }}>
                <Typography variant="body1">{entry.date} <MonitorHeartRounded/></Typography>
                <Typography variant="body2"><i>{entry.description}</i></Typography>
                <HealthCheckRatingIcon rating={entry.healthCheckRating} />
                {entry?.diagnosisCodes && <DiagnosesList entry_diagnoses={entry.diagnosisCodes}/>}
                <Typography variant="body2">diagnose by {entry.specialist}</Typography>
            </Box>);
    };

    const Hospital = ({entry}: {entry: HospitalEntry}) => {
        return (
            <Box sx={{ border: 1, borderRadius: 2, marginTop: "0.5em", padding: "0.5em" }}>
                <Typography variant="body1">{entry.date} <LocalHospitalRounded/></Typography>
                <Typography variant="body2"><i>{entry.description}</i></Typography>
                {entry?.diagnosisCodes && <DiagnosesList entry_diagnoses={entry.diagnosisCodes}/>}
                <Typography variant="body2">diagnose by {entry.specialist}</Typography>
            </Box>);

    };

    const Occupational = ({entry}: { entry: OccupationalHealthcareEntry}) => {
        return (
            <Box sx={{ border: 1, borderRadius: 2, marginTop: "0.5em", padding: "0.5em" }}>
                <Typography variant="body1">{entry.date} <WorkRounded/> <i>{entry.employerName}</i></Typography>
                <Typography variant="body2"><i>{entry.description}</i></Typography>
                {entry?.diagnosisCodes && <DiagnosesList entry_diagnoses={entry.diagnosisCodes}/>}
                <Typography variant="body2">diagnose by {entry.specialist}</Typography>
            </Box>);

    };
    
    const EntryInfo = ({entry}: { entry: Entry}) => {
        switch (entry.type) {
            case "Hospital":
                return  <Hospital entry={entry} />;
            case "HealthCheck":
                return <HealthCheck entry={entry} />;
            case "OccupationalHealthcare":
                return <Occupational entry={entry} />;
            default:
                return assertNever(entry);
        }
    };

    return(
        <Box style={{ marginTop: "1.5em" }}>
            <Typography variant="h6">entries</Typography>
            {entries.map(entry => <EntryInfo key={entry.id} entry={entry}/>)}
        </Box>
    );
};