import React from 'react';
import PropTypes from 'prop-types';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { Polyline } from 'react-leaflet';
import { ConnectionDto } from 'tour-360-backend/src/models/interfaces';

const styles = (theme: Theme) => ({

});

interface ConnectionProps extends WithStyles<typeof styles> {
    isSelected: boolean;
    connection: ConnectionDto;
    onClick: (e: { origin: Connection, connection: ConnectionDto, lEvent: any }) => void;
}

class Connection extends React.Component<ConnectionProps> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    static propTypes = {
        onClick: PropTypes.func.isRequired,
        isSelected: PropTypes.bool.isRequired,
        connection: PropTypes.shape({
            startPlace: PropTypes.shape({
                latitude: PropTypes.number.isRequired,
                longitude: PropTypes.number.isRequired,
            }),
            endPlace: PropTypes.shape({
                latitude: PropTypes.number.isRequired,
                longitude: PropTypes.number.isRequired,
            }),
        }),
    };

    _handleClick(e) {
        this.props.onClick({ origin: this, connection: this.props.connection, lEvent: e });
    }

    render() {
        const { connection, isSelected } = this.props;
        const color = isSelected ? green[500] : blue[500];

        return (<Polyline
            color={color}
            positions={[
                [connection.startPlace.latitude, connection.startPlace.longitude],
                [connection.endPlace.latitude, connection.endPlace.longitude]
            ]}
            onClick={this._handleClick}
        />)
    }
}

export default withStyles(styles)(Connection);
