import React from 'react';
import { DialogTitle as MuiDialogTitle } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const DialogTitleWithClose = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 6,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose, borderBottom, theme } = props;
    const style = {};
    if (borderBottom) {
        style['borderBottom'] = `1px solid ${theme.palette.divider}`;
    }
    return (
        <MuiDialogTitle disableTypography className={classes.root} style={style}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

export default DialogTitleWithClose;