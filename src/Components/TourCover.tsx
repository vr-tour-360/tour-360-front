import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: Theme) => ({
    cover: {
        width: '100%',
        height: '100%',
    },
    noCover: {
        maxWidth: '100%',
        maxHeight: '100%',
        padding: theme.spacing.unit * 6,
    },
});

interface TourCoverProps extends WithStyles<typeof styles> {
    imageUrl: string;
    hasImage: boolean;
    name: string;
}

export class TourCover extends PureComponent<TourCoverProps>{
    static propTypes = {
        imageUrl: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        hasImage: PropTypes.bool.isRequired,
    };

    render() {
        const { classes, imageUrl, hasImage, name } = this.props;
        const className = hasImage ? classes.cover : classes.noCover;

        return (<img className={className} src={imageUrl} alt={name} />);
    }
}

export default withStyles(styles)(TourCover);
