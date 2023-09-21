import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

function NflPlayerPosFilters({ selectedPosition, onPositionChange, filterPlayersByPosition }) {
    const positions = ['All', 'QB', 'WR', 'RB', 'TE', 'D'];
    // console.log('selectedPosition,selectedPosition);', selectedPosition)
    // const handleSearch = (event) => {
    //     const searchTerm = event.target.value;
    //     setSearchText(searchTerm);
    //     onSearch(searchTerm);  // Notify the parent component
    // };
    return (
        <ButtonGroup>
            {positions.map(position => (
                <Button
                    key={position}
                    onClick={() => {
                        onPositionChange(position)
                        filterPlayersByPosition(position)
                    }}
                    variant="outlined"
                    style={{ backgroundColor: selectedPosition === position ? '#00203d' : 'white', color: selectedPosition === position ? 'white' : 'black' }}
                >
                    {position}
                </Button>
            ))}
        </ButtonGroup>
    );
}

export default NflPlayerPosFilters;