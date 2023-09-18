import React, { useState } from 'react';
import { TextField } from '@mui/material';

function NFLPlayerSearch({ onSearch }) {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchText(searchTerm);
        onSearch(searchTerm);  // Notify the parent component
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <TextField 
                label="Search Player/Team" 
                variant="outlined" 
                fullWidth 
                value={searchText}
                onChange={handleSearch} 
            />
        </div>
    );
}

export default NFLPlayerSearch;
