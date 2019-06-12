import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Theme, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { WIDTH, HEIGHT, getScreenX, getScreenY } from './utils';

const MAIN_AXIS_WEIGHT = 3;

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        width: WIDTH,
        height: HEIGHT,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'black',
        backgroundColor: 'rgba(255,255,255, 0.5)'
    },
    axis: {
        borderColor: 'black',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    axisX: {
        height: MAIN_AXIS_WEIGHT,
        width: '100%'
    },
    axisY: {
        width: MAIN_AXIS_WEIGHT,
        height: '100%'
    },
    lineX: {
        width: 2,
        height: '100%',
    },
    lineY: {
        width: '100%',
        height: 2,
    },
    label: {
        position: 'absolute',
        // layoutOrigin: [-0.5, 0.5],
    }
});

interface CoordinateSystemProps extends WithStyles<typeof styles> {
    className?: string;
    width?: number;
    height?: number;
    stepX?: number;
    stepY?: number;
}

class CoordinateSystem extends React.Component<CoordinateSystemProps> {
    static propTypes = {
        className: PropTypes.string,
    };

    getPositionsX() {
        const {
            width = WIDTH,
            stepX = 100,
        } = this.props;
        const amountStepX = Math.ceil(width / stepX / 2);
        const positions = [0]

        for (let i = 1; i < amountStepX; i++) {
            positions.push(i * stepX);
            positions.unshift(i * stepX * -1);
        }

        return positions;
    }

    getPositionsY() {
        const {
            height = HEIGHT,
            stepY = 100,
        } = this.props;
        const amountStepY = Math.ceil(height / stepY / 2);
        const positions = [0]

        for (let i = 1; i < amountStepY; i++) {
            positions.push(i * stepY);
            positions.unshift(i * stepY * -1);
        }

        return positions;
    }

    render() {
        const positionsX = this.getPositionsX();
        const positionsY = this.getPositionsY();

        const { classes, className } = this.props;

        const root = classNames({
            [className]: !!className,
            [classes.root]: true,
        });

        return (
            <div className={root}>
                <div className={`${classes.axis} ${classes.axisX}`} style={{ top: getScreenY(0) }} />
                {positionsX.map((left) => <div key={`x_${left}`} className={`${classes.axis} ${classes.lineX}`} style={{ left: getScreenX(left) }} />)}
                {positionsX.map((left) => <span key={`label_x_${left}`} className={classes.label} style={{ left: getScreenX(left) + 5, top: getScreenY(0) + 5 }}>{left}</span>)}
                <div className={`${classes.axis} ${classes.axisY}`} style={{ left: getScreenX(0) }} />
                {positionsY.map((top) => <div key={`y_${top}`} className={`${classes.axis} ${classes.lineY}`} style={{ top: getScreenY(top) }} />)}
                {positionsY.map((i) => <span key={`label_y_${i}`} className={classes.label} style={{ left: getScreenX(5), top: getScreenY(i) + 5 }}>{i}</span>)}
            </div >
        );
    }
}

export default withStyles(styles)(CoordinateSystem);
