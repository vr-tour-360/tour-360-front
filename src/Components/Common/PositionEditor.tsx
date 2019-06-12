import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { HEIGHT, WIDTH } from './../PlaceDesigner/utils';

interface PositionEditorProps {
    x: number;
    y: number;
    onXChanged: (event: { origin: PositionEditor, value: number }) => void;
    onYChanged: (event: { origin: PositionEditor, value: number }) => void;
}

class PositionEditor extends React.Component<PositionEditorProps> {
    constructor(props) {
        super(props);

        this._handleXChanged = this._handleXChanged.bind(this);
        this._handleYChanged = this._handleYChanged.bind(this);
    }

    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        onXChanged: PropTypes.func.isRequired,
        onYChanged: PropTypes.func.isRequired,
    };

    _handleXChanged(e) {
        this.props.onXChanged({
            origin: this,
            value: parseInt(e.target.value),
        });
    }

    _handleYChanged(e) {
        this.props.onYChanged({
            origin: this,
            value: parseInt(e.target.value),
        });
    }

    render() {
        const { x, y } = this.props;

        return <>
            <TextField
                label="Position X"
                value={x}
                onChange={this._handleXChanged}
                type="number"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: WIDTH / 2,
                    min: - WIDTH / 2,
                    step: 25,
                }}
                fullWidth
                autoFocus
            />
            <TextField
                label="Position Y"
                value={y}
                onChange={this._handleYChanged}
                type="number"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: HEIGHT / 2,
                    min: - HEIGHT / 2,
                    step: 25,
                }}
                fullWidth
            />
        </>;
    }
}

export default PositionEditor;