import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';

const styles: StyleRulesCallback = (theme: Theme) => ({
    slider: {
        padding: '16px 12px',
    },
    thumb: {
        width: 20,
        height: 20,
    }
});

interface PlacePositionProps extends WithStyles<typeof styles> {
    id: string;
    label: string;
    value: number;
    onChange: (event: React.ChangeEvent<{}>, value: number) => void;
}

class PlacePosition extends React.Component<PlacePositionProps> {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    render() {
        const { classes } = this.props;
        const { id, label, value, onChange } = this.props;

        return <>
            <Typography id={id}>{label}</Typography>
            <Slider
                classes={{ container: classes.slider, thumb: classes.thumb }}
                value={value}
                aria-labelledby={id}
                min={0}
                max={359}
                step={1}
                onChange={onChange}
            />
            <Typography variant="caption" align="right">{value}</Typography>
        </>;
    }
}

export default withStyles(styles)(PlacePosition);
