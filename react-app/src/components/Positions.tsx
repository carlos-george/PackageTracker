// @flow 
import { Container, createStyles, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Theme, Toolbar, Typography } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import api from '../service/api';
import { RouteIF } from "../util/models";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            minWidth: 650,
        },
        toolbar: {
            marginTop: theme.spacing(4),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
            backgroundColor: "gray",
            borderTopLeftRadius: theme.spacing(2),
            borderTopRightRadius: theme.spacing(2)
        },
    }),
);

export const Positions = () => {

    const classes = useStyles();
    const [routes, setRoutes] = useState<RouteIF[]>([]);
    const [formFields, setFormFields] = useState({
        name: ''
    });

    useEffect(() => {

        api.get('/routes').then((response) => {
            const result = response.data;

            setRoutes(result);
        });
    }, []);

    return (
        <Container maxWidth="md">
            <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                    <Typography variant="h4" id="tableTitle" component="div">
                        Tracking Log
            </Typography>
                    <form noValidate autoComplete="off">
                        <TextField id="standard-full-width" label="route" fullWidth value={formFields.name} onChange={(event) => setFormFields({ name: event.target.value })} />
                    </form>
                </Grid>
                <Grid item xs={12}>
                    <Toolbar className={classes.toolbar}>
                        <Typography variant="h5" id="tableTitle" component="div">
                            routes
                    </Typography>
                    </Toolbar>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">Title</TableCell>
                                    <TableCell align="center">Start</TableCell>
                                    <TableCell align="center">End</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {routes.map((route) => (
                                    <TableRow key={route._id}>
                                        <TableCell align="center">{route._id}</TableCell>
                                        <TableCell align="center">
                                            {route.title}
                                        </TableCell>
                                        <TableCell align="center">
                                            {route.startPosition.lat} | {route.startPosition.lng}
                                        </TableCell>
                                        <TableCell align="center">
                                            {route.endPosition.lat} | {route.endPosition.lng}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
};