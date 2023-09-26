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

function NFLPlayerGroups(props) {
    const [activeGroupId, setActiveGroupId] = useState(null);

    const generateUniqueId = () => {
        return new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
    };

    const handleCreateGroup = () => {
        props.setGroups(prev => [...prev, {
            id: generateUniqueId(),
            name: "New Group",
            players: [],
            minFromGroup: 1,
            maxExposure: 50,
        }]);
    };

    const handleSelectGroup = (id) => {
        setActiveGroupId(id);
    };

    const getActiveGroupIndex = () => {
        return props.groups.findIndex(group => group.id === activeGroupId);
    };

    const handleCheckboxChange = (playerName, isChecked) => {
        const activeGroupIndex = getActiveGroupIndex();
        if (activeGroupIndex === -1) return;

        props.setGroups(prev => {
            const newGroup = { ...prev[activeGroupIndex] };
            if (isChecked) {
                newGroup.players.push(playerName);
            } else {
                const playerIndex = newGroup.players.indexOf(playerName);
                if (playerIndex > -1) {
                    newGroup.players.splice(playerIndex, 1);
                }
            }
            return [
                ...prev.slice(0, activeGroupIndex),
                newGroup,
                ...prev.slice(activeGroupIndex + 1),
            ];
        });
    };

    const handleDeleteGroup = (id) => {
        const index = props.groups.findIndex(group => group.id === id);
        if (index === -1) return;

        if (id === activeGroupId) {
            setActiveGroupId(null);
        }

        props.setGroups(prev => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
        ]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '30%', height: "90%", overflowY: 'auto' }}>
                <Button onClick={handleCreateGroup} variant="contained">Create Player Group</Button>
                {props.groups.map((group) => (
                    <div
                        key={group.id}
                        style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start' }}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                            onClick={() => handleSelectGroup(group.id)}>
                            <h1>{group.name}</h1>
                            <Button
                                size="small"
                                style={{ color: 'red', fontSize: '32px' }}
                                onClick={() => handleDeleteGroup(group.id)}>
                                X
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {activeGroupId && props.groups[getActiveGroupIndex()] && (
                <div style={{ width: '70%', height: "500px", overflowY: 'auto' }}>
                    <h4 style={{
                        marginBottom: 8
                    }}>Edit Group Settings</h4>
                    <TextField
                        style={{ margin: 4 }}
                        label="Group Name"
                        value={props.groups[getActiveGroupIndex()]?.name || ''}
                        onChange={e => {
                            const newName = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, getActiveGroupIndex()),
                                { ...prev[getActiveGroupIndex()], name: newName },
                                ...prev.slice(getActiveGroupIndex() + 1),
                            ]);
                        }}
                    />
                    <TextField
                        style={{ margin: 4 }}
                        type="number"
                        label="Min From Group"
                        value={props.groups[getActiveGroupIndex()]?.minFromGroup || ''}
                        onChange={e => {
                            const newMin = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, getActiveGroupIndex()),
                                { ...prev[getActiveGroupIndex()], minFromGroup: parseInt(newMin) },
                                ...prev.slice(getActiveGroupIndex() + 1),
                            ]);
                        }}
                    />
                    <TextField
                        style={{ margin: 4 }}
                        type="number"
                        label="Max Exposure"
                        value={props.groups[getActiveGroupIndex()]?.maxExposure || ''}
                        onChange={e => {
                            const newMaxExposure = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, getActiveGroupIndex()),
                                { ...prev[getActiveGroupIndex()], maxExposure: parseInt(newMaxExposure) },
                                ...prev.slice(getActiveGroupIndex() + 1),
                            ]);
                        }}
                    />

                    <h4>Current Group Players</h4>
                    <TableContainer component={Paper} style={{ width: '100%', height: '45%', overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>FPPG</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.groups[getActiveGroupIndex()].players.map((playerName, index) => {
                                    const player = props.filteredPlayers.find(p => p.Nickname === playerName) || { Nickname: 'Unknown', FPPG: 'Unknown' };
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{player.Nickname}</TableCell>
                                            <TableCell>{player.FPPG}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <h4>Add Players to Group</h4>
                    <TableContainer component={Paper} style={{ width: '100%', height: '45%', overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Use</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>FPPG</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.filteredPlayers.map((player, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                checked={props.groups[getActiveGroupIndex()].players.includes(player.Nickname)}
                                                onChange={(e) => handleCheckboxChange(player.Nickname, e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>{player.Nickname}</TableCell>
                                        <TableCell>{player.FPPG}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    );
}

export default NFLPlayerGroups;

