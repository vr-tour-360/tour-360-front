import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Paper, Typography } from '@material-ui/core';
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const styles = (theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    cover: {
        width: '100%',
    },
    titleWrapper: {
        display: 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: theme.spacing.unit,
        marginBottom: 0,
    },
    title: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as 'nowrap',
    },
    descriptionWrapper: {
        margin: theme.spacing.unit,
        marginTop: 0,
        overflow: 'auto',
    },
    description: {
        color: grey[700],
    }
});

interface InfoPanelProps extends WithStyles<typeof styles> {
    classNames?: {
        root?: string,
    },
    imageUrl?: string;
    title: string;
    description?: string;
    titleChildren?: React.ReactElement;
}

class InfoPanel extends React.Component<InfoPanelProps> {
    static propTypes = {
        classNames: PropTypes.shape({
            root: PropTypes.string,
        }),
        imageUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        titleChildren: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            classes,
            title,
            imageUrl,
            description,
            classNames = {},
            titleChildren,
        } = this.props;

        const root = classnames({
            [classes.root]: true,
            [classNames.root]: Boolean(classNames.root),
        });

        return <Paper className={root}>
            <img src={imageUrl} className={classes.cover} />
            <div className={classes.titleWrapper}>
                <Typography variant="h4" align='left'>{title}</Typography>
                {titleChildren && titleChildren}
            </div>
            <div className={classes.descriptionWrapper}>
                <Typography variant="body1" className={classes.description}>{description}</Typography>
            </div>
        </Paper>;
    }
}

export default withStyles(styles)(InfoPanel);