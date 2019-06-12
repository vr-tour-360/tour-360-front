import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { intlShape, injectIntl } from 'react-intl';
import {
    Button,
    Checkbox,
    TextField,
    Typography,
    FormControlLabel,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import {
    PositionEditor,
    PanoVideoEditor,
} from './../../../Common';
import RunVideoShape from "./RunVideoShape";
import { RunVideoWidget } from "tour-360-backend/src/models/interfaces";
import { BACKEND_URL } from '../../../../config';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
    slider: {
        padding: '16px 12px',
    },
    thumb: {
        width: 20,
        height: 20,
    },
    sliderContainer: {
        overflow: 'hidden',
    }
});

interface RunVideoEditPanelProps extends WithStyles<typeof styles> {
    //TODO: install typings for react-intl
    intl: any;
    widget: RunVideoWidget;
    onNameChanged: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget, value: string }) => void;
    onVolumeChanged: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget, value: number }) => void;
    onMutedChanged: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget, value: boolean }) => void;
    onXChanged: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget, value: number }) => void;
    onYChanged: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget, value: number }) => void;
    onDeleteClick: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget }) => void;
    onPanoVideoChanged: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget, file: File }) => void;
    onPanoVideoRemoveClick: (e: { origin: RunVideoEditPanel, widget: RunVideoWidget }) => void;
}

class RunVideoEditPanel extends React.Component<RunVideoEditPanelProps> {
    constructor(props: RunVideoEditPanelProps) {
        super(props);
    }

    static propTypes = {
        widget: RunVideoShape,
        intl: intlShape,
        onNameChanged: PropTypes.func.isRequired,
        onVolumeChanged: PropTypes.func.isRequired,
        onXChanged: PropTypes.func.isRequired,
        onYChanged: PropTypes.func.isRequired,
    };

    render() {
        const { widget, classes } = this.props;
        const { messages, formatMessage } = this.props.intl;
        const volume = Math.trunc(widget.volume * 100);

        return <div className={classes.root}>
            <TextField
                label="Name"
                value={widget.name}
                onChange={(e) => {
                    this.props.onNameChanged({
                        origin: this,
                        value: e.target.value,
                        widget: this.props.widget,
                    });
                }}
                margin="normal"
                fullWidth
            />
            <PositionEditor
                x={widget.x}
                y={widget.y}
                onXChanged={(e) => {
                    this.props.onXChanged({
                        origin: this,
                        value: e.value,
                        widget: this.props.widget,
                    });
                }}
                onYChanged={(e) => {
                    this.props.onYChanged({
                        origin: this,
                        value: e.value,
                        widget: this.props.widget,
                    });
                }}
            />
            <div className={classes.sliderContainer}>
                <Typography>{formatMessage(messages.volume)}</Typography>
                <Slider
                    classes={{ container: classes.slider, thumb: classes.thumb }}
                    value={volume}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(e, value) => {
                        this.props.onVolumeChanged({
                            origin: this,
                            value: value / 100,
                            widget: this.props.widget,
                        });
                    }}
                />
                <Typography variant="caption" align="right">{volume}</Typography>
            </div>
            <PanoVideoEditor
                url={widget.video ? `${BACKEND_URL}${widget.video.filename}` : null}
                filename={widget.video && widget.video.filename}
                onPanoVideoChanged={(e) => this.props.onPanoVideoChanged({
                    origin: this,
                    file: e.file,
                    widget: this.props.widget,
                })}
                onPanoVideoRemoved={(e) => this.props.onPanoVideoRemoveClick({
                    origin: this,
                    widget: this.props.widget,
                })}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={widget.muted}
                        onChange={(e) => {
                            this.props.onMutedChanged({
                                origin: this,
                                widget: this.props.widget,
                                value: e.target.checked,
                            });
                        }}
                        value="isPublic"
                    />
                }
                label={formatMessage(messages.muted)}
            />
            <Button fullWidth variant="text" color="primary" onClick={() => this.props.onDeleteClick({
                origin: this,
                widget: this.props.widget,
            })}>
                {formatMessage(messages.delete)}
            </Button>
        </div >
    }
}

export default withStyles(styles)(injectIntl(observer((RunVideoEditPanel))));
