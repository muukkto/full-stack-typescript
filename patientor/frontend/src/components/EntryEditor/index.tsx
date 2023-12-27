import { Favorite, FavoriteBorder, LocalHospitalRounded, MonitorHeartRounded, WorkRounded } from "@mui/icons-material";
import { Box, Button, Checkbox, IconButton, Input, InputLabel, ListItemText, MenuItem, OutlinedInput, Rating, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { EntryFormValues } from "../../types";

import diagnoses from "../../services/diagnoses";

interface Props {
    onClose: () => void;
    onSubmit: (entryValues: EntryFormValues) => void;
}

const diagnoses_alternatives = await diagnoses.getAll();

export const EntryEditor = ({onClose, onSubmit} : Props) => {
    const [form, setForm] = useState("hospital");
    const [buttonColors, setButtonColors] = useState({hospital: "primary", healthcheck: "secondary", occupational: "secondary"});


    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [diagnoses, setDiagnoses] = useState<string[]>([]);

    const [employer, setEmployer] = useState("");
    const [sickStartDate, setSickStartDate] = useState("");
    const [sickEndDate, setSickEndDate] = useState("");

    const [dischargeDate, setDischargeDate] = useState("");
    const [dischargeCriteria, setDischargeCriteria] = useState("");

    const [healthCheckRate, setHealthCheckRate] = useState(1);


    const showHospital = () => {
        setForm("hospital");
        setButtonColors({hospital: "primary", healthcheck: "secondary", occupational: "secondary"});
    };

    const showHealthCheck = () => {
        setForm("healtcheck");
        setButtonColors({hospital: "secondary", healthcheck: "primary", occupational: "secondary"});
    };

    const showOccupational = () => {
        setForm("occupational");
        setButtonColors({hospital: "secondary", healthcheck: "secondary", occupational: "primary"});
    };

    const addEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        const basicEntry = {
            description: description,
            date: date,
            specialist: specialist,
            diagnosisCodes: diagnoses
        };


        if (form === "hospital") {
            onSubmit({
                ...basicEntry,
                discharge: {date: dischargeDate, criteria: dischargeCriteria},
                type: "Hospital",
            });
        } else if (form === "healtcheck") {
            onSubmit({
                ...basicEntry,
                healthCheckRating: (4-healthCheckRate),
                type: "HealthCheck"
            });
        } else {
            onSubmit({
                ...basicEntry,
                employerName: employer,
                sickLeave: {startDate: sickStartDate, endDate: sickEndDate},
                type: "OccupationalHealthcare"
            });
        }
    };

    const SepcificFields = () => {
        if (form === "hospital") {
            return (
                <>
                <Typography variant="subtitle1">Discharge</Typography>
                <InputLabel>Date</InputLabel>
                <Input
                    id="dis_date"
                    type="date"
                    value={dischargeDate}
                    onChange={({target}) => setDischargeDate(target.value)}
                />
                <TextField
                    fullWidth 
                    id="dis_criteria"
                    label="Criteria"
                    variant="standard"
                    value={dischargeCriteria}
                    onChange={({target}) => setDischargeCriteria(target.value)}
                />
                </>
            );
        } else if (form === "healtcheck") {
            return (
                <Rating
                    max={4}
                    value={healthCheckRate}
                    icon={<Favorite/>}
                    emptyIcon={<FavoriteBorder/>}
                    onChange={(_event, newValue) => setHealthCheckRate(newValue ? newValue: 1)}
                />
            );
        } else {
            return (
                <>
                <TextField
                    fullWidth
                    id="employer"
                    label="Employer name"
                    variant="standard"
                    value={employer}
                    onChange={({target}) => setEmployer(target.value)}
                />
                <Typography variant="subtitle1">Sick leave</Typography>
                <InputLabel>Start date</InputLabel>
                <Input
                    id="sick_start_date"
                    type="date"
                    value={sickStartDate}
                    onChange={({target}) => setSickStartDate(target.value)}
                />
                <InputLabel>End date</InputLabel>
                <Input
                    id="sick_end_date"
                    type="date"
                    value={sickEndDate}
                    onChange={({target}) => setSickEndDate(target.value)}
                />
                </>
            );
        }
    };

    const DiagnosesField = () => {
        const handleChange = (event: SelectChangeEvent<typeof diagnoses>) => {
            const {
              target: { value },
            } = event;
            setDiagnoses(
              typeof value === 'string' ? value.split(',') : value,
            );
          };

        return (
            <>
            <InputLabel id="diagnoses-label">Diagnoses</InputLabel>
            <Select
                fullWidth
                labelId="diagnoses-label"
                id="diagnoses"
                multiple
                value={diagnoses}
                onChange={handleChange}
                input={<OutlinedInput label="Diagnoses" />}
                renderValue={(selected) => selected.join(', ')}
            >
                {(diagnoses_alternatives).map((diagnosis) => (
                    <MenuItem key={diagnosis.code} value={diagnosis.code}>
                        <Checkbox checked={diagnoses.indexOf(diagnosis.code) > -1} />
                        <ListItemText primary={diagnosis.code + ` - ` + diagnosis.name} />
                    </MenuItem>
                ))}
            </Select>
            </>
        );

    };

    const CommonFields = () => {
        return (
        <>
            <TextField
                fullWidth
                id="description"
                label="Description"
                variant="standard"
                value={description}
                onChange={({target}) => setDescription(target.value)}
            />
            <InputLabel>Date</InputLabel>
            <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={({target}) => setDate(target.value)}
            />
            <TextField
                fullWidth
                id="specialist"
                label="Specialist"
                variant="standard"
                value={specialist}
                onChange={({target}) => setSpecialist(target.value)}
            />
            <SepcificFields />
            <DiagnosesField />
        </>
        );
    };

    const Form = () => {
        return (
            <form onSubmit={addEntry}>
                <CommonFields />
                <Button variant="contained" color="warning" onClick={() => onClose()}>Cancel</Button>
                <Button variant="contained" sx={{float: "right"}} type="submit">Add</Button>
            </form>
        );
    };


    const title = () => {
        if (form === "hospital") {
            return "New Hospital entry";
        } else if (form === "healtcheck") {
            return "New HealthCheck entry";
        } else {
            return "New OccupationalHealthcare entry";
        }
    };

    return (
        <Box sx={{ border: 1, borderRadius: 1, borderStyle: "dashed", marginTop: "0.5em", padding: "0.5em" }}>
            <IconButton color={buttonColors.hospital} onClick={() => showHospital()}><LocalHospitalRounded /></IconButton>
            <IconButton color={buttonColors.healthcheck} onClick={() => showHealthCheck()}><MonitorHeartRounded /></IconButton>
            <IconButton color={buttonColors.occupational} onClick={() => showOccupational()}><WorkRounded /></IconButton>
            <Typography variant="h6">{title()}</Typography>
            <Form />
        </Box>
    );
};