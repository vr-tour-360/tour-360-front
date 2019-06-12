import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Button, CircularProgress } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        position: 'relative',
    },
    signInProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
});

interface LoadingButtonProps extends WithStyles<typeof styles> {
    style?: any;
    disabled?: boolean;
    onClick: (e: { origin: LoadingButton }) => void;
    isLoading?: boolean;
    children: any;
    color?: any;
    size?: any;
}

class LoadingButton extends React.Component<LoadingButtonProps> {
    static propTypes = {
        style: PropTypes.object,
        color: PropTypes.string,
        disabled: PropTypes.bool,
        isLoading: PropTypes.bool,
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
        onClick: PropTypes.func.isRequired,
        size: PropTypes.string,
    };

    render() {
        const {
            classes,
            style,
            disabled = false,
            onClick,
            isLoading = false,
            children,
            color = "primary",
            size = "medium"
        } = this.props;

        return <div className={classes.root} style={style || {}}>
            <Button
                fullWidth={true}
                disabled={disabled}
                color={color}
                onClick={() => onClick({ origin: this })}
                size={size}
            >
                {children}
            </Button>
            {isLoading && <CircularProgress size={24} className={classes.signInProgress} />}
        </div>;
    }
}

export default withStyles(styles)(LoadingButton);