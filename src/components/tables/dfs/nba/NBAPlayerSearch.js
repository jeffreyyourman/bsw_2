import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import {
    IoMdSearch,
    IoIosSearch,
} from "react-icons/io";


function NBAPlayerSearch(props) {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchText(searchTerm);
        props.onSearch(searchTerm);  // Notify the parent component
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <TextField
                label={props.isShowingExcludePlayers ? 'Search Exluded Players/Teams' : "Search Player/Team"}
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IoIosSearch />
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}

export default NBAPlayerSearch;
