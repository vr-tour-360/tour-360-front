import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import {
    Button,
    Typography,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@material-ui/core';
import { withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import {
    Error as ErrorIcon,
} from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import { intlShape, injectIntl } from 'react-intl';

const styles: StyleRulesCallback = theme => ({
    root: {
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'flex-start',
    },
    notification: {
        width: "50%",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${grey[300]}`,
        maxHeight: 300,
    },
    text: {
        color: grey[900],
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 0,
    },
});

interface NotificationMessageProps extends WithStyles<typeof styles> {
    intl: any;

    title: string;
    text: string;
    type: "error" | string;
    onClickOutside: (e: { origin: NotificationMessage }) => void;
    onClose: (e: { origin: NotificationMessage }) => void;
}

class NotificationMessage extends React.Component<NotificationMessageProps> {
    static propTypes = {
        intl: intlShape,
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        type: PropTypes.string,
        onClickOutside: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    _getIcon() {
        if (this.props.type === "error") {
            return <ErrorIcon color="error" style={{ width: 80, height: 80, marginRight: 10 }} />;
        }

        return null;
    }

    render() {
        const { classes, title, text, onClickOutside, onClose } = this.props;
        const { messages, formatMessage } = this.props.intl;

        return <div className={classes.root} onClick={() => onClickOutside && onClickOutside({ origin: this })}>
            <div className={classes.notification} onClick={(e) => e.stopPropagation()}>
                {title && <DialogTitle>{title}</DialogTitle>}
                <DialogContent className={classes.content}>
                    {this._getIcon()}
                    <Typography variant="body1" className={classes.text}>{text}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => onClose && onClose({ origin: this })} color="primary">
                        {formatMessage(messages.cancel)}
                    </Button>
                </DialogActions>
            </div>
        </div >;
    }
}

export default withStyles(styles)(observer(injectIntl(NotificationMessage)));