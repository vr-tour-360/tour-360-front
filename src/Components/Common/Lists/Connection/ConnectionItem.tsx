import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import {
    ListItem,
    ListItemText,
    IconButton
} from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import { ConnectionDetailDto } from '../../../../../../backend/src/models/interfaces';

const styles: StyleRulesCallback = (theme: Theme) => ({
    coordinateItem: {
        color: grey[700],
        lineHeight: 1,
    },
});

interface ConnectionItemProps extends WithStyles<typeof styles> {
    intl: any;
    connection: ConnectionDetailDto;
    onClick: (e: { origin: ConnectionItem, connection: ConnectionDetailDto }) => void;
    onViewClick: (e: { origin: ConnectionItem, connection: ConnectionDetailDto }) => void;
    onRemoveClick: (e: { origin: ConnectionItem, connection: ConnectionDetailDto }) => void;
    onEditClick: (e: { origin: ConnectionItem, connection: ConnectionDetailDto }) => void;
}

class ConnectionItem extends React.Component<ConnectionItemProps> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
        this._handleViewClick = this._handleViewClick.bind(this);
        this._handleRemoveClick = this._handleRemoveClick.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        connection: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        }).isRequired,
        onClick: PropTypes.func.isRequired,
        onViewClick: PropTypes.func.isRequired,
        onRemoveClick: PropTypes.func.isRequired,
        onEditClick: PropTypes.func.isRequired,

        intl: intlShape.isRequired,
    };

    _handleClick(e) {
        e.stopPropagation();
        this.props.onClick({ origin: this, connection: this.props.connection });
    }

    _handleViewClick(e) {
        e.stopPropagation();
        this.props.onViewClick({ origin: this, connection: this.props.connection });
    }

    _handleRemoveClick(e) {
        e.stopPropagation();
        this.props.onRemoveClick({ origin: this, connection: this.props.connection });
    }

    _handleEditClick(e) {
        e.stopPropagation();
        this.props.onEditClick({ origin: this, connection: this.props.connection });
    }

    render() {
        const { classes, connection } = this.props;
        const { messages, formatMessage } = this.props.intl;

        return (
            <ListItem
                button
                alignItems="flex-start"
                onClick={this._handleClick}>
                {/* <ListItemIcon> */}
                <IconButton onClick={this._handleViewClick}>
                    <VisibilityIcon />
                </IconButton>
                {/* </ListItemIcon> */}
                <ListItemText
                    primary={connection.name}
                    secondary={
                        <React.Fragment>
                            <Typography component="span" variant="caption" className={classes.coordinateItem}>
                                {formatMessage(messages.latitude)}: {connection.latitude.toFixed(0)}
                            </Typography>
                            <Typography component="span" variant="caption" className={classes.coordinateItem}>
                                {formatMessage(messages.longitude)}: {connection.longitude.toFixed(0)}
                            </Typography>
                        </React.Fragment>
                    }
                />
                <IconButton onClick={this._handleEditClick}>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={this._handleRemoveClick}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        );
    }
}

export default withStyles(styles)(injectIntl(ConnectionItem));
