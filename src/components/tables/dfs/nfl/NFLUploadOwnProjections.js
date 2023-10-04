
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

function NFLUploadOwnProjections(props) {
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [selectedGame, setSelectedGame] = useState('');
    const generateUniqueId = () => {
        return new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
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
            </div>

        </div>
    );
}

export default NFLUploadOwnProjections;


