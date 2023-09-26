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
    const [activeGroupIndex, setActiveGroupIndex] = useState(null);

    const handleCreateGroup = () => {
        props.setGroups(prev => [...prev, {
            name: "New Group",
            players: [],
            minFromGroup: 1,
            maxExposure: 50,
        }]);
    };

    const handleSelectGroup = (index) => {
        setActiveGroupIndex(index);
    };

    const handleCheckboxChange = (playerName, isChecked) => {
        if (activeGroupIndex === null) return;

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

    const handleDeleteGroup = (index) => {
        props.setGroups(prev => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
        ]);
        if (index === activeGroupIndex) {
            setActiveGroupIndex(null);
        } else if (index < activeGroupIndex) {
            setActiveGroupIndex(activeGroupIndex - 1);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '20%', height: "90%", overflowY: 'auto' }}>
                <Button onClick={handleCreateGroup} variant="contained">Create Group</Button>
                {props.groups.map((group, index) => (
                    <div
                        key={index}
                        style={{ display: 'flex', cursor: 'pointer', justifyContent: 'space-between' }}>
                        <div onClick={() => handleSelectGroup(index)}>{group.name}</div>
                        <Button size="small" color="secondary" onClick={() => handleDeleteGroup(index)}>Delete</Button>
                    </div>
                ))}
            </div>

            {activeGroupIndex !== null && (
                <div style={{ width: '80%', height: "500px", overflowY: 'auto' }}>
                    {/* Settings section */}
                    <h4>Edit Group Settings</h4>
                    <TextField
                        label="Group Name"
                        value={props.groups[activeGroupIndex].name}
                        onChange={e => {
                            const newName = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, activeGroupIndex),
                                { ...prev[activeGroupIndex], name: newName },
                                ...prev.slice(activeGroupIndex + 1),
                            ]);
                        }}
                    />
                    <TextField
                        type="number"
                        label="Min From Group"
                        value={props.groups[activeGroupIndex].minFromGroup}
                        onChange={e => {
                            const newMin = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, activeGroupIndex),
                                { ...prev[activeGroupIndex], minFromGroup: parseInt(newMin) },
                                ...prev.slice(activeGroupIndex + 1),
                            ]);
                        }}
                    />
                    <TextField
                        type="number"
                        label="Max Exposure"
                        value={props.groups[activeGroupIndex].maxExposure}
                        onChange={e => {
                            const newMaxExposure = e.target.value;
                            props.setGroups(prev => [
                                ...prev.slice(0, activeGroupIndex),
                                { ...prev[activeGroupIndex], maxExposure: parseInt(newMaxExposure) },
                                ...prev.slice(activeGroupIndex + 1),
                            ]);
                        }}
                    />

                    {/* Players in the current group */}
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
                                {props.groups[activeGroupIndex].players.map((playerName, index) => {
                                    const player = props.filteredPlayers.find(p => p.Nickname === playerName);
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

                    {/* Adding players to the group */}
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
                                                checked={props.groups[activeGroupIndex].players.includes(player.Nickname)}
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


// import React, { useState } from 'react';
// import { Button } from '@mui/material';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
// } from '@material-ui/core';

// function NFLPlayerGroups(props) {
//     console.log('groups',props.groups);
//     const [activeGroupIndex, setActiveGroupIndex] = useState(null);
//     const handleCreateGroup = () => {
//         props.setGroups(prev => [...prev, []]);
//     };

//     const handleSelectGroup = (index) => {
//         setActiveGroupIndex(index);
//     };

//     const handleCheckboxChange = (playerName, isChecked) => {
//         if (activeGroupIndex === null) return;

//         props.setGroups(prev => {
//             const newGroup = [...prev[activeGroupIndex]];
//             if (isChecked) {
//                 newGroup.push(playerName);
//             } else {
//                 const playerIndex = newGroup.indexOf(playerName);
//                 if (playerIndex > -1) {
//                     newGroup.splice(playerIndex, 1);
//                 }
//             }
//             return [
//                 ...prev.slice(0, activeGroupIndex),
//                 newGroup,
//                 ...prev.slice(activeGroupIndex + 1),
//             ];
//         });
//     };

//     const handleDeleteGroup = (index) => {
//         props.setGroups(prev => [
//             ...prev.slice(0, index),
//             ...prev.slice(index + 1),
//         ]);
//         // If the currently active group is deleted, reset the activeGroupIndex
//         if (index === activeGroupIndex) {
//             setActiveGroupIndex(null);
//         } else if (index < activeGroupIndex) {
//             setActiveGroupIndex(activeGroupIndex - 1);
//         }
//     };
//     return (
//         <div style={{ display: 'flex', flexDirection: 'row' }}>
//             <div style={{ width: '20%', height: "90%", overflowY: 'auto' }}>
//                 <Button onClick={handleCreateGroup} variant="contained">Create Group</Button>
//                 {props.groups.map((group, index) => (
//                     <div
//                         key={index}
//                         style={{ display: 'flex', cursor: 'pointer', justifyContent: 'space-between' }}>
//                         <div onClick={() => handleSelectGroup(index)}>Group {index + 1}</div>
//                         <Button size="small" color="secondary" onClick={() => handleDeleteGroup(index)}>Delete</Button>
//                     </div>
//                 ))}
//             </div>
//             {activeGroupIndex !== null && (
//                 <div style={{ width: '80%', height: "500px", overflowY: 'auto' }}>

//                     <h4>Current Group Players</h4>
                    // <TableContainer component={Paper} style={{ width: '100%', height: '45%', overflowY: 'auto' }}>
                    //     <Table>
                    //         <TableHead>
                    //             <TableRow>
                    //                 <TableCell>Name</TableCell>
                    //                 <TableCell>FPPG</TableCell>
                    //             </TableRow>
                    //         </TableHead>
                    //         <TableBody>
                    //             {props.groups[activeGroupIndex].map((playerName, index) => {
                    //                 const player = props.filteredPlayers.find(p => p.Nickname === playerName);
                    //                 return (
                    //                     <TableRow key={index}>
                    //                         <TableCell>{player.Nickname}</TableCell>
                    //                         <TableCell>{player.FPPG}</TableCell>
                    //                     </TableRow>
                    //                 );
                    //             })}
                    //         </TableBody>
                    //     </Table>
                    // </TableContainer>


//                     <h4>Active Group: Group {activeGroupIndex + 1}</h4>
//                     <h4>Add Players to Group</h4>
                    // <TableContainer component={Paper} style={{ width: '100%', height: '45%', overflowY: 'auto' }}>
                    //     <Table>
                    //         <TableHead>
                    //             <TableRow>
                    //                 <TableCell>Use</TableCell>
                    //                 <TableCell>Name</TableCell>
                    //                 <TableCell>FPPG</TableCell>
                    //             </TableRow>
                    //         </TableHead>
                    //         <TableBody>
                    //             {props.filteredPlayers.map((player, index) => (
                    //                 <TableRow key={index}>
                    //                     <TableCell>
                    //                         <input
                    //                             type="checkbox"
                    //                             checked={props.groups[activeGroupIndex].includes(player.Nickname)}
                    //                             onChange={(e) => handleCheckboxChange(player.Nickname, e.target.checked)}
                    //                         />
                    //                     </TableCell>
                    //                     <TableCell>{player.Nickname}</TableCell>
                    //                     <TableCell>{player.FPPG}</TableCell>
                    //                 </TableRow>
                    //             ))}
                    //         </TableBody>
                    //     </Table>
                    // </TableContainer>


//                 </div>
//             )}
//         </div>
//     );
// }

// export default NFLPlayerGroups;

