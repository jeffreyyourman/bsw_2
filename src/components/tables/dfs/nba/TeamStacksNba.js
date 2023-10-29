import React, { useState } from 'react';
import {
    Button,
    Checkbox,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';

function TeamStacksNba(props) {
    const [activeGroupId, setActiveGroupId] = useState(null);


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // can be 'error', 'info', 'success', or 'warning'


    const generateUniqueId = () => {
        return new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
    };
    const allTeams = Array.from(new Set(props.gameMatchups.flatMap(game => [game.homeTeam.teamAbb, game.awayTeam.teamAbb]))).sort();


    const handleCreateGroup = () => {
        props.setGroups(prev => [...prev, {
            id: generateUniqueId(),
            name: "New Team Stack",
            stackType: 'team',
            numPlayers: 3,
            forTeam: '',
            forPositions: [],
            // minFromGroup: 1,
            // maxFromGroup: 4,
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

    const saveToBackend = (data) => {
        console.log("Saving to backend:", data[0]);

        axios.post(
            `${props.baseUrl}/saveNbaPlayerGroups`,
            { data: data[0] },
            {
                // headers,
                // timeout: 600000  // 10 minutes in milliseconds
            }
        )
            .then((response) => {
                setSnackbarMessage('Team Stacks saved successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error(error);
                setSnackbarMessage('Error saving NBA Team Stacks.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };


    const handleToggleGroupEnabled = (id) => {
        const index = props.groups.findIndex(group => group.id === id);
        if (index === -1) return;

        props.setGroups(prev => [
            ...prev.slice(0, index),
            { ...prev[index], enabled: !prev[index].enabled },
            ...prev.slice(index + 1),
        ]);
    };

    return (
        <div style={{
            display: 'flex',
            height: '90%',
            flexDirection: 'row',
        }}>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                style={{ zIndex: 2000 }}  // this is the added line
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <div
                className="playerGroupLeftSideWrapper"
                style={{
                    width: '30%',
                    backgroundColor: 'white',
                    marginTop: 16,
                    padding: 16,
                    overflowY: 'auto',
                    marginRight: 8,
                }}>
                <Button onClick={handleCreateGroup}
                    style={{ backgroundColor: '#00203d', marginBottom: '16px' }}
                    variant="contained">Create Team Stack</Button>
                <div style={{ height: 'calc(90% - 36px)', overflowY: 'auto' }}>
                    {props.groups.map((group) => (
                        <div
                            key={group.id}
                            style={{ display: 'flex', cursor: 'pointer', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexGrow: 1
                                }}
                                onClick={() => handleSelectGroup(group.id)}>
                                <Checkbox
                                    color="primary"
                                    checked={group.enabled || false}
                                    onChange={() => handleToggleGroupEnabled(group.id)}
                                />
                                <h1 style={{ flexGrow: 1, margin: 0 }}>{group.name}</h1>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}>
                                    X
                                </Button>
                            </div>
                        </div>
                        // <div
                        //     key={group.id}
                        //     style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start' }}>
                        //     <div
                        //         style={{
                        //             display: 'flex',
                        //             flexDirection: 'row',
                        //             alignItems: 'center'
                        //         }}
                        //         onClick={() => handleSelectGroup(group.id)}>
                        //         <h1>{group.name}</h1>
                        //         <Button
                        //             size="small"
                        //             style={{ color: 'red', fontSize: '32px' }}
                        //             onClick={() => handleDeleteGroup(group.id)}>
                        //             X
                        //         </Button>
                        //     </div>
                        // </div>
                    ))}
                </div>
            </div>
            {activeGroupId && props.groups[getActiveGroupIndex()] && (
                <div
                    className="playerGroupRightSideWrapper"
                    style={{
                        width: '70%',
                        backgroundColor: 'white',
                        overflowY: 'auto',
                        marginTop: 16,
                        padding: 16,
                    }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        marginBottom: '12px',
                    }}>

                        <h4 style={{ marginBottom: 16, marginTop: 24 }}>Edit Team Stacks</h4>
                        <div >
                            {/* <div style={{ width: '100%', marginTop: 16 }}> */}
                            <Button
                                style={{ backgroundColor: '#00203d' }}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    saveToBackend(props.groups)
                                }}>Save for later</Button>

                        </div>
                    </div>
                    <TextField
                        style={{ margin: '24px 0px' }}
                        label="Group Name"
                        variant="outlined"
                        fullWidth
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
                        label="Number of Players"
                        fullWidth
                        variant="outlined"
                        value={props.groups[getActiveGroupIndex()]?.numPlayers || ''}
                        onChange={e => {
                            const newNumPlayers = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, getActiveGroupIndex()),
                                { ...prev[getActiveGroupIndex()], numPlayers: parseInt(newNumPlayers) },
                                ...prev.slice(getActiveGroupIndex() + 1),
                            ]);
                        }}
                    />

                    {/* <TextField
                        style={{ margin: '24px 0px' }}
                        type="number"
                        label="Min From Group"
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
                        label="Max From Group"
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
                    /> */}

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
                        <FormControl fullWidth variant="outlined" style={{ margin: '24px 0px' }}>
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

                    <div style={{ width: '48%' }}>
                        <h4 style={{ marginTop: 24, marginBottom: 8 }}>Select Team for Group</h4>
                        <TextField
                            select
                            fullWidth
                            variant="outlined"
                            value={props.groups[getActiveGroupIndex()]?.forTeam || ''}
                            onChange={e => {
                                const newTeam = e.target.value;
                                props.setGroups(prev => [
                                    ...prev.slice(0, getActiveGroupIndex()),
                                    { ...prev[getActiveGroupIndex()], forTeam: newTeam },
                                    ...prev.slice(getActiveGroupIndex() + 1),
                                ]);
                            }}
                            style={{ margin: '24px 0px' }}
                        >
                            <MenuItem value="">
                                <em>Select a team</em>
                            </MenuItem>
                            {allTeams.map((team, index) => (
                                <MenuItem key={index} value={team}>
                                    {team}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    {/* <div style={{ width: '100%', marginTop: 16 }}>
                        <Button
                            style={{ backgroundColor: '#00203d' }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                saveToBackend(props.groups)
                            }}>Save for later</Button>

                    </div> */}
                </div>
            )}
        </div>
    );
}

export default TeamStacksNba;


// import React, { useState } from 'react';
// import { Button, TextField } from '@mui/material';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
// } from '@material-ui/core';

// function TeamStacksNba(props) {
//     const [activeGroupId, setActiveGroupId] = useState(null);
//     const [selectedGame, setSelectedGame] = useState('');
//     const generateUniqueId = () => {
//         return new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
//     };

//     const handleCreateGroup = () => {
//         props.setGroups(prev => [...prev, {
//             id: generateUniqueId(),
//             name: "New Team Stack",
//             stackType: 'singleTeamStack',
//             numPlayers: 3,
//             forTeam: '',
//             forPositions: [],
//             minFromGroup: 1,
//             maxFromGroup: 4,
//             maxExposure: 100
//         }]);
//     };

//     const handleSelectGroup = (id) => {
//         setActiveGroupId(id);
//     };

//     const getActiveGroupIndex = () => {
//         return props.groups.findIndex(group => group.id === activeGroupId);
//     };

//     const handleCheckboxChange = (playerName, isChecked) => {
//         const activeGroupIndex = getActiveGroupIndex();
//         if (activeGroupIndex === -1) return;

//         props.setGroups(prev => {
//             const newGroup = { ...prev[activeGroupIndex] };
//             if (isChecked) {
//                 newGroup.players.push(playerName);
//             } else {
//                 const playerIndex = newGroup.players.indexOf(playerName);
//                 if (playerIndex > -1) {
//                     newGroup.players.splice(playerIndex, 1);
//                 }
//             }
//             return [
//                 ...prev.slice(0, activeGroupIndex),
//                 newGroup,
//                 ...prev.slice(activeGroupIndex + 1),
//             ];
//         });
//     };

//     const handleDeleteGroup = (id) => {
//         const index = props.groups.findIndex(group => group.id === id);
//         if (index === -1) return;

//         if (id === activeGroupId) {
//             setActiveGroupId(null);
//         }

//         props.setGroups(prev => [
//             ...prev.slice(0, index),
//             ...prev.slice(index + 1),
//         ]);
//     };

//     return (
//         <div style={{
//             display: 'flex',
//             height: '90%',
//             flexDirection: 'row',
//         }}>
//             <div
//                 className="playerGroupLeftSideWrapper"
//                 style={{
//                     width: '30%',
//                     backgroundColor: 'white',
//                     marginTop: 16,
//                     padding: 16,
//                     overflowY: 'auto',
//                     marginRight: 8,
//                     // boxShadow: '0 2px 8px rgba(26, 24, 27, 0.06)',

//                 }}>
//                 <Button onClick={handleCreateGroup}
//                     style={{ backgroundColor: '#00203d' }}
//                     variant="contained">Create Game Stack</Button>
//                 <div style={{ height: 'calc(90% - 36px)', overflowY: 'auto' }}>
//                     {props.groups.map((group) => (
//                         <div
//                             key={group.id}
//                             style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start' }}>
//                             <div
//                                 style={{
//                                     display: 'flex',
//                                     flexDirection: 'row',
//                                     alignItems: 'center'
//                                 }}
//                                 onClick={() => handleSelectGroup(group.id)}>
//                                 <h1>{group.name}</h1>
//                                 <Button
//                                     size="small"
//                                     style={{ color: 'red', fontSize: '32px' }}
//                                     onClick={() => handleDeleteGroup(group.id)}>
//                                     X
//                                 </Button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {activeGroupId && props.groups[getActiveGroupIndex()] && (
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
//                         style={{ margin: '24px 0px' }}
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
//                         style={{ margin: '24px 0px' }}
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
//                         style={{ margin: '24px 0px' }}
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
//                         style={{ margin: '24px 0px' }}
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
//                         <select
//                             multiple={true}
//                             value={props.groups[getActiveGroupIndex()]?.forPositions || []}
//                             onChange={e => {
//                                 const selectedOptions = [...e.target.options]
//                                     .filter(option => option.selected)
//                                     .map(option => option.value);

//                                 props.setGroups(prev => [
//                                     ...prev.slice(0, getActiveGroupIndex()),
//                                     { ...prev[getActiveGroupIndex()], forPositions: selectedOptions },
//                                     ...prev.slice(getActiveGroupIndex() + 1),
//                                 ]);
//                             }}
//                             style={{ width: '100%', height: '100px' }}
//                         >
//                             {props.positions.map(position => (
//                                 <option key={position} value={position}>{position}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div style={{ width: '48%' }}>
//                         <h4 style={{ marginTop: 24, marginBottom: 8 }}>Select Game for Group</h4>
//                         <select
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
//                             <option value=''>Select a game</option>
//                             {props.gameMatchups.map((game, index) => (
//                                 <option key={index} value={game.gameMatchup}>{game.gameMatchup}</option>
//                             ))}
//                         </select>
//                     </div>

//                 </div>
//             )}
//         </div>
//     );
// }

// export default TeamStacksNba;


