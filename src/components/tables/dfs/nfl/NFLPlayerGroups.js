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
} from '@mui/material';

function NFLPlayerGroups(props) {
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [groupSearchTerm, setGroupSearchTerm] = useState("");

    const generateUniqueId = () => {
        return new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
    };

    const handleCreateGroup = () => {
        props.setGroups(prev => [...prev, {
            id: generateUniqueId(),
            stackType: 'playerGroup',
            name: "New Player Group",
            players: [],
            minFromGroup: 1,
            maxFromGroup: 4,
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

    const saveToBackend = (data) => {
        // Make API call here
        console.log("Saving to backend:", data);
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

    const displayedPlayers = props.filteredPlayers.filter(player =>
        player.Nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );



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
                    overflowY: 'hidden',
                    marginRight: 8,
                    // boxShadow: '0 2px 8px rgba(26, 24, 27, 0.06)',

                }}>
                <Button onClick={handleCreateGroup}
                    style={{ backgroundColor: '#00203d', marginBottom: '16px' }}
                    variant="contained">Create Player Group</Button>
                <div style={{ height: 'calc(90% - 36px)', overflowY: 'auto' }}>
                    {props.groups.map((group) => (
                        <div
                            key={group.id}
                            style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start' }}>
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
                                ))}
                            </div>
                            {/* <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                                onClick={() => handleSelectGroup(group.id)}>
                                <h1>{group.name}</h1>

                                <input
                                    type="checkbox"
                                    checked={group.enabled || false}
                                    onChange={() => handleToggleGroupEnabled(group.id)}
                                />


                                <Button
                                    size="small"
                                    style={{ color: 'red', fontSize: '32px' }}
                                    onClick={() => handleDeleteGroup(group.id)}>
                                    X
                                </Button>
                            </div> */}
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
                        overflowY: 'hidden',
                        marginTop: 16,
                        padding: 16,
                        // boxShadow: '0 2px 8px rgba(26, 24, 27, 0.06)',

                    }}>
                    <h4 style={{ marginBottom: 16, marginTop: 24 }}>Edit Group Settings</h4>

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
                        label="Max From Group"
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

                    <div style={{ width: '100%', marginTop: 16 }}>
                        <Button
                            style={{ backgroundColor: '#00203d' }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                saveToBackend(props.groups)
                            }}>Save for later</Button>

                    </div>

                    <div style={{ display: 'flex', height: '300px', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div style={{ width: '48%' }}>
                            <h4 style={{ marginTop: 24, marginBottom: 8 }}>Add Players to Group</h4>
                            <TextField
                                style={{ marginBottom: 16 }}
                                label="Search Players"
                                variant="outlined"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                fullWidth
                            />
                            <TableContainer component={Paper} style={{ width: '100%', height: '90%', overflowY: 'auto' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Use</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>FPPG</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {displayedPlayers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    No players found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            displayedPlayers.map((player, index) => (
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
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div style={{ width: '48%' }}>
                            <h4 style={{ marginTop: 24, marginBottom: 8 }}>Current Group Players</h4>
                            <TableContainer component={Paper} style={{ height: '90%', overflowY: 'auto' }}>
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
                        </div>


                    </div>


                </div>
            )}
        </div>
    );
}

export default NFLPlayerGroups;

