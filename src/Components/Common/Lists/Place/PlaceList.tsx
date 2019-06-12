import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import PlaceItem from './PlaceItem';
import { List, ListSubheader, Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import classnames from 'classnames';
import { intlShape, injectIntl } from 'react-intl';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${grey[300]}`,
    },
});

interface PlaceListProps extends WithStyles<typeof styles> {
    intl: { messages, formatMessage };
    canDelete: boolean;
    canClick: boolean;
    places: any[];
    className: string;
    onClick: (e: { origin: typeof PlaceItem, place: any }) => void;
    onViewClick: (e: { origin: typeof PlaceItem, place: any }) => void;
    onDeleteClick: (e: { origin: typeof PlaceItem, place: any }) => void;
    onEditClick: (e: { origin: typeof PlaceItem, place: any }) => void;
}

class PlaceList extends React.Component<PlaceListProps> {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        className: PropTypes.string,
        places: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })).isRequired,
        canClick: PropTypes.bool.isRequired,
        canDelete: PropTypes.bool.isRequired,
        onClick: PropTypes.func,
        onViewClick: PropTypes.func.isRequired,
        onEditClick: PropTypes.func.isRequired,
        onDeleteClick: PropTypes.func,

        intl: intlShape.isRequired,
    };

    render() {
        const {
            classes,
            className,
            places,
            canClick,
            canDelete,
            onClick,
            onViewClick,
            onDeleteClick,
            onEditClick,
        } = this.props;
        const hasPlaces = places && places.length > 0;
        const { messages, formatMessage } = this.props.intl;

        const root = classnames({
            [classes.root]: true,
            [className]: !!className,
        });

        return (
            <List className={root} subheader={<ListSubheader>{formatMessage(messages.placeListTitle)}</ListSubheader>} >
                {hasPlaces && (places || []).map(place => <PlaceItem
                    key={place.id}
                    place={place}
                    canClick={canClick}
                    canDelete={canDelete}
                    onClick={onClick}
                    onViewClick={onViewClick}
                    onDeleteClick={onDeleteClick}
                    onEditClick={onEditClick}
                />)}
                {!hasPlaces && <Typography align="center" variant="caption" color="textPrimary">{formatMessage(messages.placeListNoPlaces)}</Typography>}
            </List>
        );
    }
}

export default withStyles(styles)(injectIntl(PlaceList));