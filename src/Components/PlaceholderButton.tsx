import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        border: 'none',
        background: 'none',
        fontSize: 'inherit',
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
            color: theme.palette.primary.dark,
        },
    },
});

interface PlaceholderButtonProps extends WithStyles<typeof styles> {
    onClick: (e) => void;
    text: string;
}

export function PlaceholderButton(props: PlaceholderButtonProps) {
    return (<button className={props.classes.root} onClick={props.onClick}>{props.text}</button>);
}

// PlaceholderButton.propTypes = {
//     classes: PropTypes.object.isRequired,
//     text: PropTypes.string.isRequired,
//     onClick: PropTypes.func.isRequired,
// };

export default withStyles(styles)(PlaceholderButton);

