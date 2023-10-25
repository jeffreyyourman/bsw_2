
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import { CSVLink } from "react-csv";
function UploadProjectionsNba(props) {
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [selectedGame, setSelectedGame] = useState('');
    const generateUniqueId = () => {
        return new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
    };


    const exportLineupsToUpload = () => {
        const player = [{
            "Id": "94505-53681",
            "Position": "WR",
            "First Name": "Tyreek",
            "Nickname": "Tyreek Hill",
            "Last Name": "Hill",
            "FPPG": 21.6,
            "Played": "4",
            "Salary": "9400",
            "Game": "NYG@MIA",
            "Team": "MIA",
            "Opponent": "NYG",
            "Injury Indicator": "",
            "Injury Details": "",
            "Tier": "",
            "Roster Position": "WR/FLEX"
        }];


        // console.log('props.data', props.data);
        const headers = Object.keys(props.data[0]);
        const csvData = props.data.map(player => headers.map(header => player[header]));

        return [headers, ...csvData];

    };



    return (
        <div style={{
            display: 'flex',
            height: '90%',
            flexDirection: 'row',
        }}>
            <div
                className="playerGroupLeftSideWrapper"
                style={{
                    width: '-webkit-fill-available',
                    backgroundColor: 'white',
                    marginTop: 16,
                    padding: 16,
                    overflowY: 'hidden',
                    marginRight: 8,
                    // boxShadow: '0 2px 8px rgba(26, 24, 27, 0.06)',

                }}>
                <p>Please make sure you use the same headers as this downloadable example template. </p>
                <p>You may add additional columns as long as they don't conflict with what's already in the headers </p>
                <p>Must have these exact headers. You may add additional but these are a must </p>
                <div>

                    <CSVLink
                        asyncOnClick={true}
                        data={exportLineupsToUpload()}

                    >
                        Download example template
                    </CSVLink>

                </div>
                <input type="file" onChange={props.handleFileUpload} />
                {props.successUploadOwnProjectionsLoading ? <p>loading...</p>
                    :
                    props.successUploadOwnProjections &&
                    <>
                        <p>successful</p>
                        <p>close this popup to continue optimizing lines!</p>
                    </>

                }
            </div>

        </div>
    );
}

export default UploadProjectionsNba;


