import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { intlShape, injectIntl } from 'react-intl';
import {
    Button,
    TextField,
} from '@material-ui/core';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import {
    PositionEditor,
    Category
} from '../../../Common';
import ImageWidgetShape from "./ImageWidgetShape";
import { ImageWidget } from "../../../../../../backend/src/models/interfaces";
import { UploadImageDialog } from '../../../Dialogs';
import EditImage from '../../../EditImage';
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

interface ImageWidgetEditPanelProps extends WithStyles<typeof styles> {
    intl: any;
    widget: ImageWidget;
    onNameChanged: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget, value: string }) => void;
    onXChanged: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget, value: number }) => void;
    onYChanged: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget, value: number }) => void;
    onWidthChanged: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget, value: number }) => void;
    onHeightChanged: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget, value: number }) => void;
    onDeleteClick: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget }) => void;
    onImageSelected: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget, file: File }) => Promise<void>;
    onImageRemoveClick: (e: { origin: ImageWidgetEditPanel, widget: ImageWidget }) => void;
}
interface ImageWidgetEditPanelState {
    uploadImageDialogOpened: boolean;
}

class ImageWidgetEditPanel extends React.Component<ImageWidgetEditPanelProps, ImageWidgetEditPanelState> {
    constructor(props: ImageWidgetEditPanelProps) {
        super(props);
        
        this.state = {
            uploadImageDialogOpened: false,
        }

        this._handleImageSelected = this._handleImageSelected.bind(this);
    }

    _handleImageSelected(e) {
        this.props.onImageSelected({
            origin: this,
            widget: this.props.widget,
            file: e.file
        }).then(() => {
            this.setState({ uploadImageDialogOpened: false });
        });
    }

    render() {
        const { widget, classes } = this.props;
        const { messages, formatMessage } = this.props.intl;

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
            <TextField
                label="Width"
                value={widget.width}
                onChange={(e) => this.props.onWidthChanged({
                            origin: this,
                            value: parseInt(e.target.value),
                            widget: this.props.widget,
                        })}
                type="number"
                margin="normal"
                inputProps={{
                    max: 4800,
                    min: 1
                }}
                fullWidth
            />
            <TextField
                label="Height"
                value={widget.height}
                onChange={(e) => this.props.onHeightChanged({
                            origin: this,
                            value: parseInt(e.target.value),
                            widget: this.props.widget,
                        })}
                type="number"
                margin="normal"
                inputProps={{
                    max: 600,
                    min: 1
                }}
                fullWidth
            />
            <Category title={"Image"}>
                <EditImage
                    name={widget.image && widget.image.filename}
                    hasImage={!!widget.image}
                    imageUrl={widget.image ? `${BACKEND_URL}${widget.image.filename}` : null}
                    onImageChangeClick={() => this.setState({ uploadImageDialogOpened: true })}
                />
            </Category>
            <Button fullWidth variant="text" color="primary" onClick={() => this.props.onDeleteClick({
                origin: this,
                widget: this.props.widget,
            })}>
                {formatMessage(messages.delete)}
            </Button>

            <UploadImageDialog
                title="Upload Image"
                prompt="Upload Image"
                isOpened={this.state.uploadImageDialogOpened}
                onFileSelected={this._handleImageSelected}
                onClose={() => this.setState({ uploadImageDialogOpened: false })}
            />
        </div >
    }

    static propTypes = {
        widget: ImageWidgetShape,
        intl: intlShape,
        onNameChanged: PropTypes.func.isRequired,
        onXChanged: PropTypes.func.isRequired,
        onYChanged: PropTypes.func.isRequired,
        onImageClick: PropTypes.func.isRequired,
    };
}

export default withStyles(styles)(injectIntl(observer((ImageWidgetEditPanel))));
