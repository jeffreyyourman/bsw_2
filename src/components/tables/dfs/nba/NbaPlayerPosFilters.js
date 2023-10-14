import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

function NbaPlayerPosFilters({ selectedPosition, onPositionChange, filterPlayersByPosition }) {
    const positions = ['All', 'PG', 'SG', 'SF', 'PF', 'C'];
    // const positions = ['All', 'QB', 'RB', 'WR', 'TE', 'D'];
    // console.log('selectedPosition,selectedPosition);', selectedPosition)
    // const handleSearch = (event) => {
    //     const searchTerm = event.target.value;
    //     setSearchText(searchTerm);
    //     onSearch(searchTerm);  // Notify the parent component
    // };
    return (
        <ButtonGroup style={{ flexWrap: 'wrap' }}>
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

export default NbaPlayerPosFilters;
