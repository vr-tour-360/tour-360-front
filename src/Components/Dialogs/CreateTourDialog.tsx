import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
    Input
} from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import DialogTitleWithClose from './DialogTItleWithClose';
import { MapType } from '../../../../backend/src/models/interfaces';

interface CreateTourDialogProps {
    intl: any;
    name: string;
    mapTypes: MapType[];
    mapTypeValue: MapType;
    isOpened: boolean;
    onCreateClick: (e: { origin: CreateTourDialog }) => void;
    onNameChanged: (e: { origin: CreateTourDialog, name: string }) => void;
    onClose: (e: { origin: CreateTourDialog }) => void;
    onMapTypeChanged: (e: { origin: CreateTourDialog, mapType: MapType }) => void;
}

class CreateTourDialog extends React.Component<CreateTourDialogProps> {
    constructor(props) {
        super(props);

        this._handleCreateClick = this._handleCreateClick.bind(this);
        this._handleNameChanged = this._handleNameChanged.bind(this);
        this._handleMapTypeChanged = this._handleMapTypeChanged.bind(this);
        this._handleClose = this._handleClose.bind(this);
    }

    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        onNameChanged: PropTypes.func.isRequired,
        onCreateClick: PropTypes.func.isRequired,
        onMapTypeChanged: PropTypes.func.isRequired,
        onClose: PropTypes.func,
        name: PropTypes.string,
        mapTypeValue: PropTypes.number.isRequired,
        mapTypes: PropTypes.arrayOf(PropTypes.number).isRequired,

        intl: intlShape.isRequired,
    };

    _handleCreateClick() {
        this.props.onCreateClick && this.props.onCreateClick({ origin: this });
    }

    _handleNameChanged(event) {
        this.props.onNameChanged && this.props.onNameChanged({ origin: this, name: event.target.value });
    }

    _handleClose() {
        this.props.onClose && this.props.onClose({ origin: this });
    }

    _handleMapTypeChanged(e) {
        this.props.onMapTypeChanged && this.props.onMapTypeChanged({ origin: this, mapType: e.target });
    }

    _displayMapType(type) {
        const { messages, formatMessage } = this.props.intl;

        switch (type) {
            case 1:
                return formatMessage(messages.createTourDialogEarth);
            case 2:
                return formatMessage(messages.createTourDialogImage)
            default:
                throw new Error('There are no such map type!')
        }
    }

    render() {
        const { name, mapTypes, mapTypeValue, isOpened } = this.props;
        const { messages, formatMessage } = this.props.intl;

        return (
            <Dialog
                onClose={this._handleClose}
                open={isOpened}
                maxWidth={'sm'}
                fullWidth>
                <DialogTitleWithClose onClose={this._handleClose}>{formatMessage(messages.createTourDialogTitle)}</DialogTitleWithClose>
                <DialogContent>
                    <TextField
                        label={formatMessage(messages.createTourDialogTourName)}
                        value={name}
                        onChange={this._handleNameChanged}
                        margin="normal"
                        fullWidth={true}
                        autoFocus
                    />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="name-disabled">{formatMessage(messages.createTourDialogMapType)}</InputLabel>
                        <Select
                            variant="filled"
                            fullWidth={true}
                            onChange={this._handleMapTypeChanged}
                            input={<Input name="name" />}
                            value={mapTypeValue}>
                            {mapTypes.map(type => <MenuItem key={type} value={type}>{this._displayMapType(type)}</MenuItem>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleCreateClick} color="primary">{formatMessage(messages.create)}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default injectIntl(CreateTourDialog);