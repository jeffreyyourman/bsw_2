
import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';

function NFLTeamGameStacks(props) {
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [selectedGame, setSelectedGame] = useState('');
    const generateUniqueId = () => {
        return new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
    };

    const handleCreateGroup = () => {
        props.setGroups(prev => [...prev, {
            id: generateUniqueId(),
            name: "New Game Stack",
            stackType: 'singleGameStack',
            // numPlayers: 3,
            forGame: '',
            forPositions: [],
            minFromGroup: 1,
            maxFromGroup: 4,
            maxExposure: 100
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
        <div style={{
            display: 'flex',
            height: '90%',
            flexDirection: 'row',
        }}>
            <div
                className="playerGroupLeftSideWrapper"
                style={{
                    width: '30%',
                    backgroundColor: 'white',
                    marginTop: 16,
                    padding: 16,
                    overflowY: 'auto',
                    marginRight: 8,
                    // boxShadow: '0 2px 8px rgba(26, 24, 27, 0.06)',

                }}>
                <Button onClick={handleCreateGroup}
                    style={{ backgroundColor: '#00203d' }}
                    variant="contained">Create Game Stack</Button>
                <div style={{ height: 'calc(90% - 36px)', overflowY: 'auto' }}>
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
            </div>
            {activeGroupId && props.groups[getActiveGroupIndex()] && (
                <div
                    className="playerGroupLeftSideWrapper"
                    style={{
                        width: '70%',
                        backgroundColor: 'white',
                        overflowY: 'auto',
                        marginTop: 16,
                        padding: 16,
                    }}
                >
                    <h4 style={{ marginBottom: 16, marginTop: 24 }}>Edit Group Settings</h4>

                    <TextField
                        style={{ margin: '24px 0px' }}
                        label="Group Name"
                        fullWidth
                        variant="outlined"
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
                        style={{ margin: '24px 0px' }}
                        type="number"
                        label="Min Players From Group"
                        fullWidth
                        variant="outlined"
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
                        style={{ margin: '24px 0px' }}
                        type="number"
                        label="Max number of Players"
                        fullWidth
                        variant="outlined"
                        value={props.groups[getActiveGroupIndex()]?.maxFromGroup || ''}
                        onChange={e => {
                            const newMax = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, getActiveGroupIndex()),
                                { ...prev[getActiveGroupIndex()], maxFromGroup: parseInt(newMax) },
                                ...prev.slice(getActiveGroupIndex() + 1),
                            ]);
                        }}
                    />


                    <TextField
                        style={{ margin: '24px 0px' }}
                        type="number"
                        label="Max Exposure"
                        fullWidth
                        variant="outlined"
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

                    <div style={{ marginTop: 24, marginBottom: 8 }}>
                        <h4>Select Positions for Group</h4>
                        <FormControl fullWidth variant="outlined" style={{ margin: 4 }}>
                            <InputLabel>Positions</InputLabel>
                            <Select
                                multiple
                                value={props.groups[getActiveGroupIndex()]?.forPositions || []}
                                onChange={e => {
                                    const selectedOptions = e.target.value;
                                    props.setGroups(prev => [
                                        ...prev.slice(0, getActiveGroupIndex()),
                                        { ...prev[getActiveGroupIndex()], forPositions: selectedOptions },
                                        ...prev.slice(getActiveGroupIndex() + 1),
                                    ]);
                                }}
                                label="Positions"
                            >
                                {props.positions.map(position => (
                                    <MenuItem key={position} value={position}>
                                        {position}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div style={{ width: '100%', marginTop: 16 }}>
                        <h4>Select Game for Group</h4>
                        <TextField
                            select
                            fullWidth
                            variant="outlined"
                            value={props.groups[getActiveGroupIndex()]?.forGame || ''}
                            onChange={e => {
                                const newGame = e.target.value;
                                props.setGroups(prev => [
                                    ...prev.slice(0, getActiveGroupIndex()),
                                    { ...prev[getActiveGroupIndex()], forGame: newGame },
                                    ...prev.slice(getActiveGroupIndex() + 1),
                                ]);
                            }}
                        >
                            <MenuItem value="">
                                <em>Select a game</em>
                            </MenuItem>
                            {props.gameMatchups.map((game, index) => (
                                <MenuItem key={index} value={game.gameMatchup}>
                                    {game.gameMatchup}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                </div>
            )}


        </div>
    );
}

export default NFLTeamGameStacks;


//   {/* {activeGroupId && props.groups[getActiveGroupIndex()] && (
//                 <div
//                     className="playerGroupLeftSideWrapper"

//                     style={{
//                         width: '70%',
//                         backgroundColor: 'white',
//                         overflowY: 'auto',
//                         marginTop: 16,
//                         padding: 16,
//                         // boxShadow: '0 2px 8px rgba(26, 24, 27, 0.06)',

//                     }}>
//                     <h4 style={{ marginBottom: 16, marginTop: 24 }}>Edit Group Settings</h4>
//                     <TextField
//                         style={{ margin: 4 }}
//                         label="Group Name"
//                         value={props.groups[getActiveGroupIndex()]?.name || ''}
//                         onChange={e => {
//                             const newName = e.target.value;
//                             props.setGroups(prev => [
//                                 ...prev.slice(0, getActiveGroupIndex()),
//                                 { ...prev[getActiveGroupIndex()], name: newName },
//                                 ...prev.slice(getActiveGroupIndex() + 1),
//                             ]);
//                         }}
//                     />
//                     <TextField
//                         style={{ margin: 4 }}
//                         type="number"
//                         label="Number of Players"
//                         value={props.groups[getActiveGroupIndex()]?.numPlayers || ''}
//                         onChange={e => {
//                             const newNumPlayers = e.target.value;
//                             props.setGroups(prev => [
//                                 ...prev.slice(0, getActiveGroupIndex()),
//                                 { ...prev[getActiveGroupIndex()], numPlayers: parseInt(newNumPlayers) },
//                                 ...prev.slice(getActiveGroupIndex() + 1),
//                             ]);
//                         }}
//                     />
//                     <TextField
//                         style={{ margin: 4 }}
//                         type="number"
//                         label="Min From Group"
//                         value={props.groups[getActiveGroupIndex()]?.minFromGroup || ''}
//                         onChange={e => {
//                             const newMin = e.target.value;
//                             props.setGroups(prev => [
//                                 ...prev.slice(0, getActiveGroupIndex()),
//                                 { ...prev[getActiveGroupIndex()], minFromGroup: parseInt(newMin) },
//                                 ...prev.slice(getActiveGroupIndex() + 1),
//                             ]);
//                         }}
//                     />
//                     <TextField
//                         style={{ margin: 4 }}
//                         type="number"
//                         label="Max Exposure"
//                         value={props.groups[getActiveGroupIndex()]?.maxExposure || ''}
//                         onChange={e => {
//                             const newMaxExposure = e.target.value;
//                             props.setGroups(prev => [
//                                 ...prev.slice(0, getActiveGroupIndex()),
//                                 { ...prev[getActiveGroupIndex()], maxExposure: parseInt(newMaxExposure) },
//                                 ...prev.slice(getActiveGroupIndex() + 1),
//                             ]);
//                         }}
//                     />

//                     <div style={{ marginTop: 24, marginBottom: 8 }}>
//                         <h4>Select Positions for Group</h4>
//                         <TextField
//                             select
//                             fullWidth
//                             variant="outlined"
//                             value={props.groups[getActiveGroupIndex()]?.forPositions || []}
//                             onChange={e => {
//                                 const selectedOptions = e.target.value;
//                                 props.setGroups(prev => [
//                                     ...prev.slice(0, getActiveGroupIndex()),
//                                     { ...prev[getActiveGroupIndex()], forPositions: selectedOptions },
//                                     ...prev.slice(getActiveGroupIndex() + 1),
//                                 ]);
//                             }}
//                             multiple
//                             style={{ width: '100%' }}
//                         >
//                             {props.positions.map(position => (
//                                 <MenuItem key={position} value={position}>
//                                     {position}
//                                 </MenuItem>
//                             ))}
//                         </TextField>
//                     </div>

//                     <div style={{ width: '100%', marginTop: 16 }}>
//                         <h4>Select Game for Group</h4>
//                         <TextField
//                             select
//                             fullWidth
//                             variant="outlined"
//                             value={props.groups[getActiveGroupIndex()]?.forGame || ''}
//                             onChange={e => {
//                                 const newGame = e.target.value;
//                                 props.setGroups(prev => [
//                                     ...prev.slice(0, getActiveGroupIndex()),
//                                     { ...prev[getActiveGroupIndex()], forGame: newGame },
//                                     ...prev.slice(getActiveGroupIndex() + 1),
//                                 ]);
//                             }}
//                         >
//                             <MenuItem value="">
//                                 <em>Select a game</em>
//                             </MenuItem>
//                             {props.gameMatchups.map((game, index) => (
//                                 <MenuItem key={index} value={game.gameMatchup}>
//                                     {game.gameMatchup}
//                                 </MenuItem>
//                             ))}
//                         </TextField>
//                     </div>

//                 </div>
//             )} */}