import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { ListItem, ListItemText, IconButton } from '@material-ui/core';
import {
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ThreeSixty as ThreeSixtyIcon,
} from '@material-ui/icons';
import PlaceListIcon from './PlaceListIcon';
import { PlaceDto } from '../../../../../../backend/src/models/interfaces';
import { BACKEND_URL } from '../../../../config';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        '&:hover': {
            '& $icon': {
                display: 'none',
            },
            '& $openPano': {
                display: 'block',
            },
        }
    },
    icon: {},
    openPano: {
        display: 'none',
    }
});

interface PlaceItemProps extends WithStyles<typeof styles> {
    onClick: (e: { origin: PlaceItem, place: PlaceDto }) => void;
    onViewClick: (e: { origin: PlaceItem, place: PlaceDto }) => void;
    onEditClick: (e: { origin: PlaceItem, place: PlaceDto }) => void;
    onDeleteClick: (e: { origin: PlaceItem, place: PlaceDto }) => void;
    place: PlaceDto;
    canDelete: boolean;
    canClick: boolean;
}

class PlaceItem extends React.Component<PlaceItemProps> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
        this._handleViewClick = this._handleViewClick.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
        this._handleDeleteClick = this._handleDeleteClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        place: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired,
        canDelete: PropTypes.bool.isRequired,
        canClick: PropTypes.bool.isRequired,
        onClick: PropTypes.func,
        onViewClick: PropTypes.func.isRequired,
        onEditClick: PropTypes.func.isRequired,
        onDeleteClick: PropTypes.func,
    };

    _handleClick(e) {
        e.stopPropagation();
        this.props.onClick && this.props.onClick({ origin: this, place: this.props.place });
    }

    _handleViewClick(e) {
        e.stopPropagation();
        this.props.onViewClick && this.props.onViewClick({ origin: this, place: this.props.place });
    }

    _handleEditClick(e) {
        e.stopPropagation();
        this.props.onEditClick && this.props.onEditClick({ origin: this, place: this.props.place });
    }

    _handleDeleteClick(e) {
        e.stopPropagation();
        this.props.onDeleteClick && this.props.onDeleteClick({ origin: this, place: this.props.place });
    }

    render() {
        const { place, canDelete, canClick, classes } = this.props;
        const iconUrl = place.mapIcon && place.mapIcon.filename && `${BACKEND_URL}${place.mapIcon.filename}`;

        return <ListItem
            className={classes.root}
            button={canClick}
            onClick={this._handleClick}
        >
            <PlaceListIcon classNames={{ root: classes.icon }} iconUrl={iconUrl} />
            <IconButton className={classes.openPano} onClick={this._handleViewClick}>
                <ThreeSixtyIcon />
            </IconButton>
            <ListItemText primary={place.name} />
            <IconButton onClick={this._handleEditClick}>
                <EditIcon />
            </IconButton>
            {canDelete && <IconButton onClick={this._handleDeleteClick}>
                <DeleteIcon />
            </IconButton>}
        </ListItem>;
    }
}

export default withStyles(styles)(PlaceItem);
