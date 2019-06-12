import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    ClickAwayListener,
} from '@material-ui/core';
import { ChromePicker } from 'react-color';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        //TODO: pass width and marginBottom via props here
        width: '100%',
        marginBottom: 10,
    },
    button: {
        width: '64px',
        height: '40px',
        border: '1px dashed grey',
    },
    colorPickerLayer: {
        position: 'absolute',
        top: '100%',
        right: 0,
        zIndex: 1,
    },
});

interface ColorPickerProps extends WithStyles<typeof styles> {
    color: string;
    label: string;
    onChanged: (e: { origin: ColorPicker, color: string }) => void;
}

interface ColorPickerState {
    isTextColorPickerActive: boolean;
}

class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {
    constructor(props) {
        super(props);

        this.state = {
            isTextColorPickerActive: false,
        };

        this._handleTextColorButtonClick = this._handleTextColorButtonClick.bind(this);
        this._handleChangeTextColor = this._handleChangeTextColor.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        color: PropTypes.string,
        label: PropTypes.string.isRequired,
        onChanged: PropTypes.func.isRequired,
    };

    _handleChangeTextColor(color) {
        this.props.onChanged({ origin: this, color: color.hex });
    }

    _handleTextColorButtonClick() {
        const { isTextColorPickerActive } = this.state;
        this.setState({ isTextColorPickerActive: !isTextColorPickerActive })
    }

    render() {
        const { isTextColorPickerActive } = this.state;
        const { classes, color, label } = this.props;

        return <div className={classes.root}>
            <span>{label}</span>
            <Button
                className={classes.button}
                style={{ backgroundColor: color }}
                color="inherit"
                fullWidth
                onClick={this._handleTextColorButtonClick}
            >
                <div></div>
            </Button>
            {isTextColorPickerActive &&
                <ClickAwayListener onClickAway={() => this.setState({ isTextColorPickerActive: false })}>
                    <ChromePicker
                        color={color}
                        onChange={this._handleChangeTextColor}
                        className={classes.colorPickerLayer}
                        disableAlpha
                    />
                </ClickAwayListener>
            }
        </div>;
    }
}

export default withStyles(styles)(ColorPicker);