import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

function NbaPlayerPosFilters(props) {
    let { pos, selectedPosition, onPositionChange } = props
    const positions = ['All', ...pos];
    
    return (
        <ButtonGroup style={{ flexWrap: 'wrap' }}>
            {positions.map(position => (
                <Button
                    key={position}
                    onClick={() => {
                        onPositionChange(position)
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
