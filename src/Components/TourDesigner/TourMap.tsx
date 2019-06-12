import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import { Map, TileLayer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { Connection, Place, } from '.';
import grey from '@material-ui/core/colors/grey';
import { TourDetail } from '../../Stores';
import { PlaceDetailDto } from '../../../../backend/src/models/interfaces';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
    },
    map: {
        flex: 1,
    },
    statusBar: {
        borderTop: `1px solid ${grey[300]}`,
        padding: 3,
    },
    field: {
        marginLeft: 5,
    },
    lable: {
        fontWeight: 700,
        marginRight: 5,
    },
    value: {}
});

export interface TourMapProps extends WithStyles<typeof styles> {
    tour: TourDetail;
    mapStyle: any;
    draggableMarkers?: boolean;
    selectedPlaceId?: string;
    selectedConnectionId?: string;
    onClick: (e: { origin: TourMap, latitude: number, longitude: number }) => void;
    onMouseMove: (e: { origin: TourMap, latitude: number, longitude: number }) => void;
    onZoomChanged: (e: { origin: TourMap, zoom: number }) => void;
    onConnectionClick: (e: { origin: TourMap, connection: any }) => void;
    onPlaceClick: (e: { origin: TourMap, place: PlaceDetailDto }) => void;
    onPlaceDragend: (e: { origin: TourMap, place: PlaceDetailDto, latitude: number, longitude: number }) => void;
};

export interface TourMapState {
    currentLat: number;
    currentLng: number;
    currentZoom: number;
}

class TourMap extends React.Component<TourMapProps, TourMapState> {
    constructor(props) {
        super(props);

        this._handleMapClick = this._handleMapClick.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleZoomChanged = this._handleZoomChanged.bind(this);
        this._handleConnectionClick = this._handleConnectionClick.bind(this);
        this._handlePlaceClick = this._handlePlaceClick.bind(this);
        this._handlePlaceDragend = this._handlePlaceDragend.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        mapStyle: PropTypes.object,
        selectedPlaceId: PropTypes.string,
        draggableMarkers: PropTypes.bool,
        tour: PropTypes.shape({
            places: PropTypes.array.isRequired,
            connections: PropTypes.array.isRequired,
            mapType: PropTypes.number.isRequired,
        }).isRequired,
        onClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onZoomChanged: PropTypes.func,
        onPlaceClick: PropTypes.func,
        onPlaceDragend: PropTypes.func,
        onConnectionClick: PropTypes.func,
    };

    state = {
        currentLat: 0,
        currentLng: 0,
        currentZoom: 0,
    }

    _handleMapClick(e) {
        this.props.onClick && this.props.onClick({
            origin: this,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
        });
    }

    _handleMouseMove(e) {
        this.setState({ currentLat: e.latlng.lat, currentLng: e.latlng.lng });

        this.props.onMouseMove && this.props.onMouseMove({
            origin: this,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
        });
    }

    _handleZoomChanged(e) {
        this.setState({ currentZoom: e.target._zoom });

        this.props.onZoomChanged && this.props.onZoomChanged({
            origin: this,
            zoom: e.target._zoom,
        });
    }

    _handleConnectionClick(e) {
        // prevent map click event
        L.DomEvent.stopPropagation(e.lEvent);

        this.props.onConnectionClick && this.props.onConnectionClick({
            origin: this,
            connection: e.connection,
        });
    }

    _handlePlaceClick(e) {
        // prevent map click event
        L.DomEvent.stopPropagation(e.lEvent);

        this.props.onPlaceClick && this.props.onPlaceClick({
            origin: this,
            place: e.place,
        });
    }

    _handlePlaceDragend(e) {
        this.props.onPlaceDragend && this.props.onPlaceDragend({
            origin: this,
            place: e.place,
            latitude: e.latitude,
            longitude: e.longitude,
        });
    }

    _renderMapContent() {
        const { tour, selectedPlaceId, selectedConnectionId, draggableMarkers = false } = this.props;
        const places = tour.places || [];
        const connections = tour.connections || [];


        return <>
            {connections.map(c => {
                const isSelected = c.id === selectedConnectionId || false;

                return <Connection
                    key={c.id}
                    isSelected={isSelected}
                    connection={c}
                    onClick={this._handleConnectionClick}
                />;
            })}
            {places.map(place => {
                const isSelected = place.id === selectedPlaceId;
                const isStart = tour.startPlaceId === place.id;

                return <Place key={place.id}
                    place={place}
                    draggable={draggableMarkers}
                    isSelected={isSelected}
                    isStart={isStart}
                    onClick={this._handlePlaceClick}
                    onDragend={this._handlePlaceDragend}
                />;
            })}
        </>;
    }

    _renderMap() {
        const { classes, tour, mapStyle } = this.props;

        if (tour.mapType === 2) {
            const bounds = [[0, 0], [tour.imageHeight, tour.imageWidth]];

            return <Map crs={L.CRS.Simple}
                bounds={bounds}
                className={classes.map}
                style={mapStyle}
                onclick={this._handleMapClick}
                onmousemove={this._handleMouseMove}
                onzoomend={this._handleZoomChanged}>
                <ImageOverlay url={tour.mapImageUrl} bounds={bounds} />
                {this._renderMapContent()}
            </Map>;
        } else if (tour.mapType === 1) {
            const state = {
                position: [0, 0],
                zoom: 5,
            };

            return (
                <Map center={state.position}
                    zoom={state.zoom}
                    className={classes.map}
                    style={mapStyle}
                    onclick={this._handleMapClick}
                    onmousemove={this._handleMouseMove}
                    onzoomend={this._handleZoomChanged}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this._renderMapContent()}
                </Map>
            );
        }

        throw new Error("Unknown map type");
    }

    _renderStatusBar() {
        const { classes } = this.props;
        const { currentLng, currentLat, currentZoom } = this.state;

        return (
            <div className={classes.statusBar}>
                <span className={classes.field}>
                    <span className={classes.lable}>X:</span>
                    <span className={classes.value}>{Math.floor(currentLng)}</span>
                </span>
                <span className={classes.field}>
                    <span className={classes.lable}>Y:</span>
                    <span className={classes.value}>{Math.floor(currentLat)}</span>
                </span>
                <span className={classes.field}>
                    <span className={classes.lable}>Z:</span>
                    <span className={classes.value}>{Math.floor(currentZoom)}</span>
                </span>
            </div>
        )
    }

    render() {
        const { classes } = this.props;

        return <div className={classes.root}>
            {this._renderMap()}
            {this._renderStatusBar()}
        </div>;
    }
}

export default withStyles(styles)(TourMap);