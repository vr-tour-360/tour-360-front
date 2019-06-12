import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles, Theme, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: grey[100],
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        padding: 5,
        border: `1px solid ${grey[300]}`,
    },
    selectedItem: {
        backgroundColor: theme.palette.secondary.light,
    }
});

export interface ToolbarItem {
    id: string;
    title: string;
    icon: React.ReactElement,
    isSelected?: boolean;
}

interface ToolbarProps extends WithStyles<typeof styles> {
    items: ToolbarItem[];
    onItemClick: (e: { origin: Toolbar, item: ToolbarItem }) => void;
}

class Toolbar extends React.Component<ToolbarProps> {
    static propTypes = {
        items: PropTypes.array.isRequired
    };

    renderItem(item: ToolbarItem) {
        const { classes } = this.props;

        return <div
            key={item.id}
            title={item.title}
            className={classnames({
                [classes.item]: true,
                [classes.selectedItem]: item.isSelected,
            })}
            onClick={(e) => this.props.onItemClick && this.props.onItemClick({ origin: this, item })}
        >
            <IconButton>{item.icon}</IconButton>
        </div>;
    }

    render() {
        const { classes, items } = this.props;

        return <div className={classes.root}>
            {items.map((widget) => this.renderItem(widget))}
        </div>;
    }
}

export default withStyles(styles)(Toolbar);