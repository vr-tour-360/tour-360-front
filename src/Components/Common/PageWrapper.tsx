import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, ListItem, ListSubheader, IconButton } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { intlShape, injectIntl } from 'react-intl';
import classnames from 'classnames';
import Header from './../Header';

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    contentWrapper: {
        flexGrow: 1,
        overflow: 'hidden',
        display: 'flex',
    },
});

interface PageWrapperProps extends WithStyles<typeof styles> {
    title: string;
    children: React.ReactNode;
}

class PageWrapper extends React.Component<PageWrapperProps> {
    static propTypes = {
        title: PropTypes.string.isRequired,
        children: PropTypes.object.isRequired,
    }

    render() {
        const { classes, title, children } = this.props;

        return <div className={classes.root}>
            <Header title={title} />
            <div className={classes.contentWrapper}>
                {children}
            </div>
        </div>
    }
}

export default withStyles(styles)(PageWrapper);