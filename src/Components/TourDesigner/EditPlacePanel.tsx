import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TextField, Button, Theme, StyleRulesCallback } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import ConnectionList from '../Common/Lists/Connection/ConnectionList';
import { EditImage } from './../';
import { EditPlace } from './../../Stores'
import SoundEditor from './SoundEditor';
import { WidgetList, IconEditor, Category } from './../Common';
import { intlShape, injectIntl } from 'react-intl';
import { BaseWidget } from '../../../../backend/src/models/interfaces';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        flex: 1,
        padding: theme.spacing.unit * 2,
    },
    panelItem: {
        marginTop: theme.spacing.unit,
    },
    descriptionRoot: {
        marginTop: 0,
        backgroundColor: 'white'
    },
});

interface EditPlacePanelProps extends WithStyles<typeof styles> {
    intl: { formatMessage, messages },
    place: EditPlace,
    onNameChanged: (e: { origin: EditPlacePanel, name: string }) => void;
    onChangeImage360Click: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
    onSoundChanged: (e: { origin: EditPlacePanel, place: EditPlace, file: File }) => void;
    onSoundRemoved: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
    onViewImage360Click: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
    onPreviewClick: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
    onDeleteClick?: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
    onDescriptionChanged: (e: { origin: EditPlacePanel, value: string }) => void;

    showConnections: boolean;
    onConnectionClick?: (e: { origin: EditPlacePanel, connection: any }) => void;
    onViewConnectionClick?: (e: { origin: EditPlacePanel, connection: any }) => void;
    onRemoveConnectionClick?: (e: { origin: EditPlacePanel, connection: any }) => void;
    onEditConnectionClick?: (e: { origin: EditPlacePanel, connection: any }) => void;

    showWidgets: boolean;
    onWidgetClick?: (e: { origin: EditPlacePanel, widget: BaseWidget }) => void;
    onRemoveWidgetClick?: (e: { origin: EditPlacePanel, widget: BaseWidget }) => void;

    onUploadMapIconClick: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
    onEditMapIconClick: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
    onClearMapIconClick: (e: { origin: EditPlacePanel, place: EditPlace }) => void;

    onChangeCoverClick: (e: { origin: EditPlacePanel, place: EditPlace }) => void;
}

class EditPlacePanel extends React.Component<EditPlacePanelProps> {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        place: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        onNameChanged: PropTypes.func.isRequired,
        onChangeImage360Click: PropTypes.func.isRequired,
        onSoundChanged: PropTypes.func.isRequired,
        onSoundRemoved: PropTypes.func.isRequired,
        onViewImage360Click: PropTypes.func.isRequired,
        onPreviewClick: PropTypes.func.isRequired,
        onDeleteClick: PropTypes.func,
        onDescriptionChanged: PropTypes.func.isRequired,

        showConnections: PropTypes.bool.isRequired,
        onConnectionClick: PropTypes.func,
        onViewConnectionClick: PropTypes.func,
        onRemoveConnectionClick: PropTypes.func,
        onEditConnectionClick: PropTypes.func,

        showWidgets: PropTypes.bool.isRequired,
        onWidgetClick: PropTypes.func,
        onRemoveWidgetClick: PropTypes.func,

        onUploadMapIconClick: PropTypes.func.isRequired,
        onEditMapIconClick: PropTypes.func.isRequired,
        onClearMapIconClick: PropTypes.func.isRequired,

        onChangeCoverClick: PropTypes.func.isRequired,

        intl: intlShape.isRequired,
    }

    get _canDelete() {
        return this.props.onDeleteClick != null;
    }

    _handleNameChanged = (e) => {
        this.props.onNameChanged({ origin: this, name: e.target.value });
    }

    _handleSoundChanged = (e) => {
        this.props.onSoundChanged({ origin: this, place: this.props.place, file: e.file });
    }

    _handleSoundRemoved = (e) => {
        this.props.onSoundRemoved({ origin: this, place: this.props.place });
    }

    _handleChangeImage360Click = (e) => {
        this.props.onChangeImage360Click({ origin: this, place: this.props.place });
    }

    _handleViewImage360Click = (e) => {
        this.props.onViewImage360Click({ origin: this, place: this.props.place });
    }

    _handlePreviewClick = (e) => {
        this.props.onPreviewClick({ origin: this, place: this.props.place });
    }

    _handleDeleteClick = (e) => {
        this.props.onDeleteClick && this.props.onDeleteClick({ origin: this, place: this.props.place });
    }

    _handleConnectionClick = (e) => {
        this.props.onConnectionClick({ origin: this, connection: e.connection });
    }

    _handleViewConnectionClick = (e) => {
        this.props.onViewConnectionClick({ origin: this, connection: e.connection });
    }

    _handleRemoveConnectionClick = (e) => {
        this.props.onRemoveConnectionClick({ origin: this, connection: e.connection });
    }

    _handleEditConnectionClick = (e) => {
        this.props.onEditConnectionClick({ origin: this, connection: e.connection });
    }

    _handleDescriptionChanged = (e) => {
        this.props.onDescriptionChanged({ origin: this, value: e.target.value });
    }

    _handleWidgetClick = (e) => {
        this.props.onWidgetClick && this.props.onWidgetClick({ origin: this, widget: e.widget });
    }

    _handleRemoveWidgetClick = (e) => {
        this.props.onRemoveWidgetClick({ origin: this, widget: e.widget });
    }

    _handleUploadMapIconClick = (e) => {
        this.props.onUploadMapIconClick({ origin: this, place: this.props.place });
    }

    _handleEditMapIconClick = (e) => {
        this.props.onEditMapIconClick({ origin: this, place: this.props.place });
    }

    _handleClearMapIconClick = (e) => {
        this.props.onClearMapIconClick({ origin: this, place: this.props.place });
    }

    _handleChangeCoverClick = (e) => {
        this.props.onChangeCoverClick({ origin: this, place: this.props.place });
    }

    render() {
        const { classes, place, showConnections, showWidgets } = this.props;
        const { messages, formatMessage } = this.props.intl;

        let mapIcon = null;

        if (place.mapIcon && place.mapIcon.filename) {
            mapIcon = {
                url: place.mapIconUrl,
                filename: place.mapIcon.filename,
                height: place.mapIcon.height,
                width: place.mapIcon.width,
            };
        }

        return <div className={classes.root}>
            <TextField
                label={formatMessage(messages.editPlacePanelPlaceName)}
                value={place.name}
                onChange={this._handleNameChanged}
                margin="normal"
                fullWidth
                autoFocus
            />
            <TextField
                label={formatMessage(messages.editPlacePanelDescription)}
                multiline
                rows={4}
                rowsMax={6}
                value={place.description}
                onChange={this._handleDescriptionChanged}
                className={classes.descriptionRoot}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <Category title={formatMessage(messages.panoImage)}>
                <EditImage
                    name={place.name}
                    hasImage={place.hasImage360}
                    imageUrl={place.mapImage360Url}
                    onImageChangeClick={this._handleChangeImage360Click}
                />
            </Category>
            <Category
                title={formatMessage(messages.editPlacePanelCoverLabel)}
                className={classes.panelItem}
            >
                <EditImage
                    name={place.cover && place.cover.filename}
                    hasImage={place.cover && place.cover.filename}
                    imageUrl={place.coverUrl}
                    onImageChangeClick={this._handleChangeCoverClick}
                />
            </Category>
            <IconEditor
                image={mapIcon}
                className={classes.panelItem}
                onUploadClick={this._handleUploadMapIconClick}
                onEditClick={this._handleEditMapIconClick}
                onClearClick={this._handleClearMapIconClick}
            />
            {showConnections && <ConnectionList
                className={classes.panelItem}
                connections={place.connections}
                onClick={this._handleConnectionClick}
                onRemoveClick={this._handleRemoveConnectionClick}
                onViewClick={this._handleViewConnectionClick}
                onEditClick={this._handleEditConnectionClick}
            />}
            <SoundEditor
                soundUrl={place.soundUrl}
                classNames={{
                    changeSound: classes.panelItem,
                    editor: classes.panelItem
                }}
                onSoundChanged={this._handleSoundChanged}
                onSoundRemoved={this._handleSoundRemoved}
            />
            {showWidgets && <WidgetList
                className={classes.panelItem}
                widgets={place.widgets}
                onClick={this._handleWidgetClick}
                onRemoveClick={this._handleRemoveWidgetClick}
            />}
            <Button fullWidth variant="text" color="primary" className={classes.selectImage} onClick={this._handleChangeImage360Click} >
                {formatMessage(messages.editPlacePanelChangePano)}
            </Button>
            <Button fullWidth variant="text" color="primary" onClick={this._handleViewImage360Click}>
                {formatMessage(messages.open)}
            </Button>
            <Button fullWidth variant="text" color="primary" onClick={this._handlePreviewClick}>
                {formatMessage(messages.preview)}
            </Button>
            {this._canDelete && <Button fullWidth variant="text" color="primary" onClick={this._handleDeleteClick}>
                {formatMessage(messages.delete)}
            </Button>}
        </div>;
    }
};

export default withStyles(styles)(injectIntl(observer(EditPlacePanel)));
