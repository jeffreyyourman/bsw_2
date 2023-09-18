import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import NFLTable from "../tables/dfs/nfl/NFLTable";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function NflDfsSiteTabs(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{ padding: 25 }}>
            <h3
                style={{ marginBottom: 15 }}
                className="has-text-weight-semibold is-size-2">
                {props.heading}
            </h3>
            <Tabs
                sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}
                value={value}
                onChange={handleChange}
                aria-label="NFl Dfs Site Tabs">
                <Tab
                    label="Fanduel"
                    sx={{
                        borderRight: '1px solid #e0e0e0',
                        backgroundColor: value === 0 ? '#00203d' : 'white',
                        color: value === 0 ? 'white !important' : '#00203d'
                    }}
                />
                <Tab
                    label="DraftKings"
                    sx={{
                        borderRight: '1px solid #e0e0e0',
                        backgroundColor: value === 1 ? '#00203d' : 'white',
                        color: value === 1 ? 'white !important' : '#00203d'

                    }}
                />
                {/* <Tab label="Fanduel" /> */}
                {/* <Tab label="DraftKings" /> */}
            </Tabs>
            <TabPanel style={{ backgroundColor: 'white' }} value={value} index={0}>
                <section className="section section--gradient">
                    <div className="container">
                        <div className="section">
                            <div className="columns">
                                <div className="column is-12">
                                    <NFLTable />
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </TabPanel>
            <TabPanel value={value} index={1}>
                DraftKings
            </TabPanel>

        </div>
    );
}

export default NflDfsSiteTabs;
