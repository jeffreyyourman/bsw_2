import React, { useState } from 'react';
import { Modal, Box, Tabs, Tab, Button } from '@mui/material';

const ProfileModal = ({ open, handleClose, logout }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                display: 'flex'
            }}>
                <Box sx={{ width: '25%', borderRight: 1, borderColor: 'divider' }}>
                    <Tabs
                        orientation="vertical"
                        value={tabValue}
                        onChange={handleTabChange}
                    >
                        <Tab style={{display:'flex', alignItems:'flex-start'}}label="Account Info" />
                        <Tab style={{display:'flex', alignItems:'flex-start'}}label="Payment Options" />
                    </Tabs>
                    <Button onClick={logout}>Log Out</Button>
                </Box>
                <Box sx={{ width: '75%', p: 3 }}>
                    {tabValue === 0 && <div>
                        <p>First name</p>
                        <p>Last name</p>
                        <p>Email</p>
                        
                        </div>}
                    {tabValue === 1 && <div>
                        <p>tier</p>
                        <p>How much you're paying</p>
                        <p>subscription active or not</p>
                        <p>credit card payment?</p>
                        </div>}
                    {/* Add more tabs content here */}
                </Box>
            </Box>
        </Modal>
    );
};

export default ProfileModal;