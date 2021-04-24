// @flow 
import React, {
    FormEvent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    Avatar,
    Button,
    createStyles,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Typography
} from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import { sample, shuffle } from 'lodash';
import { Loader } from 'google-maps';
import { useSnackbar } from 'notistack';
import io from 'socket.io-client';

import { RouteIF } from '../util/models';
import api from '../service/api';
import { getCurrentPosition } from '../util/geolocation';
import { makeCarIcon, makeMarkerIcon, Map } from '../util/map';
import { RouteExistsError } from '../errors/route-exists.error';
import { NavBar } from './NavBar';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
        },
        form: {
            margin: "16px",
        },
        btnSubmitWrapper: {
            textAlign: "center",
            marginTop: "8px",
        },
        map: {
            width: "100%",
            height: "100%",
        },
        routeFinished: {
            marginTop: '5px',
            textAlign: 'center'
        }
    }),
);

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);
const BASE_URL = process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : 'http://localhost:3000';

const colors = [
    "#b71c1c",
    "#4a148c",
    "#2e7d32",
    "#e65100",
    "#2962ff",
    "#c2185b",
    "#FFCD00",
    "#3e2723",
    "#03a9f4",
    "#827717",
];

export const Mapping = () => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [routes, setRoutes] = useState<RouteIF[]>([]);
    const [finishedRoutes, setFinishedRoutes] = useState<RouteIF[]>([]);
    const [routeIdSelected, setRouteIdSelected] = useState<string>('');
    const mapRef = useRef<Map>();
    const socketIORef = useRef<SocketIOClient.Socket>();

    const finishRoute = useCallback((route: RouteIF) => {

        enqueueSnackbar(`${route.title} finalizou!`, {
            variant: 'success',
        });

        mapRef.current?.removeRoute(route._id);

        const newRoutes = routes.filter(item => item._id !== route._id);

        setRoutes(newRoutes);

        setRouteIdSelected('');

        setFinishedRoutes((prevState) => [...prevState, route]);

    }, [enqueueSnackbar, routes, routeIdSelected]);

    useEffect(() => {

        if (!socketIORef.current?.connected) {

            socketIORef.current = io.connect(BASE_URL);

            socketIORef.current.on('connect', () => console.log('Socket is connected!'));
        }

        const handler = (data: {
            routeId: string;
            position: [number, number];
            finished: boolean;
        }) => {
            console.log('Data: ', data)
            mapRef.current?.moveCurrentMarker(data.routeId, {
                lat: data.position[0],
                lng: data.position[1],
            });

            const route = routes.find((route) => route._id === data.routeId) as RouteIF;

            if (data.finished) {
                finishRoute(route);
            }
        };

        socketIORef.current?.on('new-position', handler);

        return () => {
            socketIORef.current?.off('new-position', handler);
        }

    }, [finishRoute, routes, routeIdSelected]);

    useEffect(() => {

        api.get('/routes').then((response) => {
            const result = response.data;
            setRoutes(result);
        });
    }, []);

    useEffect(() => {

        (async () => {
            await googleMapsLoader.load();
            const [, position] = await Promise.all([
                googleMapsLoader.load(),
                getCurrentPosition({ enableHighAccuracy: true })
            ]);
            const divMap = document.getElementById('map') as HTMLElement;
            mapRef.current = new Map(divMap, {
                zoom: 15,
                center: position
            });
        })();
    }, [])

    const startRoute = useCallback((event: FormEvent) => {
        event.preventDefault();

        const route = routes.find((route) => route._id === routeIdSelected);

        const color = sample(shuffle(colors)) as string;

        try {

            mapRef.current?.addRoute(routeIdSelected, {
                currentMarkerOptions: {
                    position: route?.startPosition,
                    icon: makeCarIcon(color)
                },
                endMarkerOptions: {
                    position: route?.endPosition,
                    icon: makeMarkerIcon(color)
                }
            });

            socketIORef.current?.emit('new-direction', {
                routeId: routeIdSelected,

            });
        } catch (error) {
            if (error instanceof RouteExistsError) {
                enqueueSnackbar(`${route?.title} já adicionado, esperar finalizar entrega.`, {
                    variant: 'error'
                });
                return;
            }

            throw error;
        }

    }, [routeIdSelected, routes, enqueueSnackbar]);

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} sm={3}>
                <NavBar />
                <form onSubmit={startRoute} className={classes.form}>
                    <Select
                        fullWidth
                        displayEmpty
                        value={routeIdSelected}
                        onChange={(event) => setRouteIdSelected(event.target.value + '')}>
                        <MenuItem value="">
                            <em>Selecione uma Corrida</em>
                        </MenuItem>
                        {routes.map((route) => (
                            <MenuItem key={route._id} value={route._id}>
                                {route.title}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className={classes.btnSubmitWrapper}>
                        <Button
                            fullWidth
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Iniciar uma Corrida
                        </Button>
                    </div>
                </form>
                <Typography variant="h6" className={classes.routeFinished}>Entregues</Typography>
                <List>
                    {finishedRoutes.map((finished) =>
                        <ListItem key={finished._id}>
                            <ListItemAvatar>
                                <Avatar>
                                    <RoomIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={finished.title} />
                        </ListItem>
                    )}
                </List>
            </Grid>
            <Grid item xs={12} sm={9}>
                <div id="map" className={classes.map} />
            </Grid>
        </Grid>
    );
};