import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Marker } from 'react-leaflet';
import L from 'leaflet';
import { PlaceDetailDto } from 'tour-360-backend/src/models/interfaces';
import { BACKEND_URL } from '../../config';

interface PlaceProps {
    place: PlaceDetailDto;
    onClick: (e: { origin: Place, place: PlaceDetailDto, lEvent: any }) => void;
    onDragend: (e: { origin: Place, place: PlaceDetailDto, latitude: number, longitude: number }) => void;
    isSelected: boolean;
    isStart: boolean;
    draggable?: boolean;
}

const defaultIcon = L.icon({
    iconUrl: '/src/markers/default.svg',
    iconSize: [25, 41],
});
const defaultSelectedIcon = L.icon({
    iconUrl: '/src/markers/selected.svg',
    iconSize: [25, 41],
});
const defaultStartIcon = L.icon({
    iconUrl: '/src/markers/start.svg',
    iconSize: [25, 41],
});

export default class Place extends Component<PlaceProps, any> {
    refmarker = createRef<Marker>();
    state = {
        icon: null,
    };

    constructor(props: PlaceProps) {
        super(props);

        const place = props.place;
        if (place.mapIcon && place.mapIcon.filename) {
            this.state.icon = L.icon({
                iconUrl: `${BACKEND_URL}${place.mapIcon.filename}`,
                iconSize: [place.mapIcon.width, place.mapIcon.height],
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        //TODO: update icon
    }

    static propTypes = {
        onClick: PropTypes.func.isRequired,
        place: PropTypes.shape({
            id: PropTypes.string.isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        }),
        isSelected: PropTypes.bool.isRequired,
        draggable: PropTypes.bool,
    };

    _getIcon() {
        if (this.state.icon) {
            //TODO: add isState and isSelected state for custom icon
            return this.state.icon;
        }
        const { isSelected, isStart } = this.props;
        const icon = isSelected ? defaultSelectedIcon : isStart ? defaultStartIcon : defaultIcon;

        return icon;
    }

    render() {
        const { place, onClick, onDragend, draggable } = this.props;
        const radius = 20;
        const icon = this._getIcon();

        return (
            <Marker
                draggable={draggable}
                icon={icon}
                key={place.id}
                position={[place.latitude, place.longitude]}
                onclick={(e) => {
                    onClick && onClick({
                        origin: this,
                        place,
                        lEvent: e,
                    });
                }}
                onDragend={e => {
                    const marker = this.refmarker.current
                    const position = marker.leafletElement.getLatLng();

                    onDragend && onDragend({
                        origin: this,
                        place,
                        latitude: position.lat,
                        longitude: position.lng,
                    });
                }}
                ref={this.refmarker}
            >
                <Tooltip permanent direction='bottom' offset={[0, radius]}>
                    <span>{place.name}</span>
                </Tooltip>
            </Marker>
        );
    }
}
