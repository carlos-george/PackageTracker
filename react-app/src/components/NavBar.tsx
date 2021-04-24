// @flow 
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';
import DriverIcon from '@material-ui/icons/DriveEta';


export const NavBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" arial-labe="menu">
                    <DriverIcon />
                </IconButton>
                <Typography variant="h6">
                    Tranking Log
                </Typography>
            </Toolbar>
        </AppBar>
    );
};