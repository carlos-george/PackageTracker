export interface PositionIF {
    lat: number;
    lng: number;
}

export interface RouteIF {
    _id: string;
    title: string;
    startPosition: PositionIF;
    endPosition: PositionIF;
}