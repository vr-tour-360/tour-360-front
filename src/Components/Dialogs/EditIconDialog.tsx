import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogContentText,
    Input,
    TextField
} from '@material-ui/core';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import DialogTitleWithClose from './DialogTItleWithClose';
import { injectIntl, intlShape } from 'react-intl';

const MIN_SIZE = 1;
const MAX_SIZE = 256;
const BORDER_WIDTH = 2;

const styles = createStyles(theme => ({
    content: {
        display: 'flex',
        flexDirection: 'row',
    },
    iconHolder: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: MAX_SIZE + BORDER_WIDTH,
        minHeight: MAX_SIZE + BORDER_WIDTH,
        marginRight: theme.spacing.unit * 2,
        borderColor: grey[500],
        borderWidth: BORDER_WIDTH,
        borderStyle: 'dashed',
    },
    inputsHolder: {
        display: 'flex',
        flexDirection: 'column',
        width: 200,
    }
}));

interface EditIconDialogState {
    width: number;
    height: number;
}

interface EditIconDialogProps extends WithStyles<typeof styles> {
    intl: any;

    title: string;
    okButtonText: string;
    isOpened: boolean;
    url: string;
    width: number;
    height: number;
    onSaveClick: (e: {
        origin: EditIconDialog,
        width: number,
        height: number,
    }) => void;
    onClose: (e: {
        origin: EditIconDialog,
    }) => void;
}

export class EditIconDialog extends React.Component<EditIconDialogProps, EditIconDialogState> {
    state: EditIconDialogState;

    constructor(props: EditIconDialogProps) {
        super(props);

        this.state = {
            width: props.width,
            height: props.height,
        };

        this._handleClose = this._handleClose.bind(this);
        this._handleSaveClick = this._handleSaveClick.bind(this);
    }

    static propTypes = {
        url: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        okButtonText: PropTypes.string,
        onSaveClick: PropTypes.func.isRequired,
        isOpened: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,

        intl: intlShape.isRequired,
    };

    _handleClose() {
        this.props.onClose({ origin: this });
    }

    _handleSaveClick() {
        this.props.onSaveClick({
            origin: this,
            width: this.state.width,
            height: this.state.height,
        });
    }

    render() {
        const { isOpened, title, url } = this.props;
        const { messages, formatMessage } = this.props.intl;
        const { width, height } = this.state;
        const classes: any = this.props.classes;

        return (
            <Dialog
                onClose={this._handleClose}
                open={isOpened}
                maxWidth={'sm'}
                fullWidth>
                <DialogTitleWithClose onClose={this._handleClose}>{title}</DialogTitleWithClose>
                <DialogContent>
                    <div className={classes.content}>
                        <div className={classes.iconHolder}>
                            <img src={url} width={width} height={height} />
                        </div>
                        <div className={classes.inputsHolder}>
                            <TextField
                                label="Width"
                                value={width}
                                onChange={(e) => this.setState({ width: parseInt(e.target.value) })}
                                type="number"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    max: MAX_SIZE,
                                    min: MIN_SIZE,
                                    step: 2,
                                }}
                                fullWidth
                                autoFocus
                            />
                            <TextField
                                label="Height"
                                value={height}
                                onChange={(e) => this.setState({ height: parseInt(e.target.value) })}
                                type="number"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    max: MAX_SIZE,
                                    min: MIN_SIZE,
                                    step: 2,
                                }}
                                fullWidth
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleSaveClick} color="primary" variant="contained" autoFocus>{formatMessage(messages.save)}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default injectIntl(withStyles(styles)(EditIconDialog));
