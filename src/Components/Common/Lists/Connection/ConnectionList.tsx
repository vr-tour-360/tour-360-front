import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import ConnectionItem from './ConnectionItem';
import {
    List,
    ListSubheader,
    Typography,
} from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import grey from '@material-ui/core/colors/grey';
import classnames from 'classnames';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${grey[300]}`,
    },
});

interface ConnectionListProps extends WithStyles<typeof styles> {
    intl: { messages: any, formatMessage: any };
    connections: any[];
    className: string;
    onClick: (e: { origin: typeof ConnectionItem, connection: any }) => void;
    onViewClick: (e: { origin: typeof ConnectionItem, connection: any }) => void;
    onRemoveClick: (e: { origin: typeof ConnectionItem, connection: any }) => void;
    onEditClick: (e: { origin: typeof ConnectionItem, connection: any }) => void;
}

class ConnectionList extends React.Component<ConnectionListProps> {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        className: PropTypes.string,
        connections: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        })).isRequired,
        onClick: PropTypes.func.isRequired,
        onViewClick: PropTypes.func.isRequired,
        onRemoveClick: PropTypes.func.isRequired,
        onEditClick: PropTypes.func.isRequired,

        intl: intlShape.isRequired,
    };

    render() {
        const { 
            classes,
            connections,
            onClick,
            onViewClick,
            onRemoveClick,
            onEditClick,
            className,
        } = this.props;
        const hasConnections = connections && connections.length > 0;
        const { messages, formatMessage } = this.props.intl;

        const root = classnames({
            [classes.root]: true,
            [className]: !!className,
        });

        return (
            <List className={root} subheader={<ListSubheader>{formatMessage(messages.connections)}</ListSubheader>} >
                {hasConnections && (connections || []).map(connection => <ConnectionItem
                    key={connection.id}
                    connection={connection}
                    onClick={onClick}
                    onViewClick={onViewClick}
                    onRemoveClick={onRemoveClick}
                    onEditClick={onEditClick}
                />)}
                {!hasConnections && <Typography align="center" variant="caption" color="textPrimary">{formatMessage(messages.noConnections)}</Typography>}
            </List>
        );
    }
}

export default withStyles(styles)(injectIntl(ConnectionList));
