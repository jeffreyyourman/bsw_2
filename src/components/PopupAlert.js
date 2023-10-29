import React, { useState } from 'react';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';
function PopupAlert(props) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // can be 'error', 'info', 'success', or 'warning'

    return (
        <Snackbar
            open={props.snackbarOpen}
            autoHideDuration={props.autoHideDuration}
            onClose={() => props.setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            style={{ zIndex: 2000 }}  // this is the added line
        >
            <Alert onClose={() => props.setSnackbarOpen(false)} severity={props.snackbarSeverity}>
                {props.snackbarMessage}
            </Alert>
        </Snackbar>
    );
}

export default PopupAlert;

