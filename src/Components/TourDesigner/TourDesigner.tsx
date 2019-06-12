import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
    Theme,
    StyleRulesCallback,
    WithStyles,
} from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import CloseIcon from '@material-ui/icons/Close';
import EditTourPanel from './EditTourPanel';
import EditConnectionPanel from './EditConnectionPanel';
import MapEditModeBar from './TourDesignerToolBar';
import { PlaceholderButton, LoadingButton } from '..';
import {
    UploadImageDialog,
    ConfirmDialog,
    HtmlEditDialog,
    ViewUrlDialog,
    EditIconDialog,
} from '../Dialogs';
import { TourMap } from '.';
import EditPlacePanel from './EditPlacePanel';
import { grey } from '@material-ui/core/colors';
import { TourEditStore, RootStore } from './../../Stores';
import { MapEditModes } from 'tour-360-backend/src/models/interfaces';
import { RouteComponentProps } from "react-router";

const styles: StyleRulesCallback = (theme: Theme) => ({
    appBar: {
        position: 'relative',
    },
    tourName: {
        flex: 1,
    },
    noImageMap: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageMapPlaceholder: {
        color: grey[700],
        fontSize: '24px',
    },
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        flex: 1,
        overflow: 'hidden',
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
        minWidth: 400,
        flexBasis: 400,
        backgroundColor: grey[100],
        borderLeft: `1px solid ${theme.palette.divider}`,
        overflowY: 'auto',
    },
});

interface TourDesignerProps extends WithStyles<typeof styles> {
    //TODO: to fix heroku build
    match: { params: { sessionId: string } };
    intl: { messages, formatMessage };
    rootStore: RootStore;
}

interface TourDesignerState {
    uploadImageDialogState: 0 | 1 | 2 | 3;
    isOpenedConfirmDialog: boolean;
    isOpenedDeleteDialog: boolean;
    isOpenedPreviewDialog: boolean;
    isOpenedEditIconDialog: boolean;
    isOpenedUploadCoverDialog: boolean;
    mapEditMode: MapEditModes;
    placeToDeleteId: string;
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const CLOSED = 0;
const TOUR_MAP = 1;
const PLACE_360 = 2;
const PLACE_MAP_ICON = 3;

class TourDesigner extends React.Component<TourDesignerProps, TourDesignerState> {
    static propTypes = {
        classes: PropTypes.object.isRequired,

        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        this._handleSave = this._handleSave.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleMapClick = this._handleMapClick.bind(this);
        this._handleNameChanged = this._handleNameChanged.bind(this);
        this._handlePlaceNameChanged = this._handlePlaceNameChanged.bind(this);
        this._handleChangePlaceImage360Click = this._handleChangePlaceImage360Click.bind(this);
        this._handleChangeImageMapClick = this._handleChangeImageMapClick.bind(this);
        this._handleFileSelected = this._handleFileSelected.bind(this);
        this._handleModeChanged = this._handleModeChanged.bind(this);
        this._handlePlaceClick = this._handlePlaceClick.bind(this);
        this._handlePlaceDragend = this._handlePlaceDragend.bind(this);
        this._handleConnectionClick = this._handleConnectionClick.bind(this);
        this._handleStartPlaceChanged = this._handleStartPlaceChanged.bind(this);
        this._handleIsPublicChanged = this._handleIsPublicChanged.bind(this);

        this._handleOkConfirmClick = this._handleOkConfirmClick.bind(this);
        this._handleCancelConfigrmClick = this._handleCancelConfigrmClick.bind(this);
        this._handleCloseConfirmDialog = this._handleCloseConfirmDialog.bind(this);

        this._handleDeletePlaceClick = this._handleDeletePlaceClick.bind(this);
        this._handleOkDeletePlaceClick = this._handleOkDeletePlaceClick.bind(this);
        this._closeDeleteDialog = this._closeDeleteDialog.bind(this);

        this._handlePreviewPlaceClick = this._handlePreviewPlaceClick.bind(this);
        this._closePreviewDialog = this._closePreviewDialog.bind(this);

        this.state = {
            uploadImageDialogState: CLOSED,
            isOpenedConfirmDialog: false,
            isOpenedDeleteDialog: false,
            isOpenedPreviewDialog: false,
            isOpenedEditIconDialog: false,
            isOpenedUploadCoverDialog: false,
            mapEditMode: 'dragMap',
            placeToDeleteId: null,
        };
    }

    componentDidMount() {
        if (!this.editingTour) {
            const sessionId = this.props.match.params.sessionId;
            this.tourStore.getFromSession(sessionId)
                .catch(error => {
                    this.props.rootStore.showError({
                        //TODO: move to en.js
                        title: "Designer cannot be opened",
                        text: `Session = ${sessionId} is not found`,
                    });
                })
        }
    }

    get tourStore(): TourEditStore {
        return this.props.rootStore.tourEditStore;
    }

    get editingPlace() {
        return this.tourStore.editingPlace;
    }

    get editingTour() {
        return this.tourStore.editingTour;
    }

    get editingConnection() {
        return this.tourStore.editingConnection;
    }

    get sessionId() {
        return this.tourStore.sessionId;
    }

    get showEditPlacePanel() {
        return Boolean(this.editingPlace);
    }

    get showEditConnectionPanel() {
        return Boolean(this.editingConnection);
    }

    get showEditTourPanel() {
        return Boolean(this.editingTour) && !this.showEditPlacePanel && !this.showEditConnectionPanel;
    }

    _handleStartPlaceChanged(e) {
        this.editingTour.startPlaceId = e.startPlaceId;
    }

    _handleIsPublicChanged(e) {
        this.editingTour.isPublic = e.isPublic;
    }

    /* Confirm Save Dialog */
    _handleOkConfirmClick() {
        this.tourStore.saveChanges().then(() => {
            this.tourStore.cancelEditing();
        }).finally(() => {
            this._handleCloseConfirmDialog();
        });
    }

    _handleCancelConfigrmClick() {
        this.tourStore.cancelEditing().finally(() => {
            this._handleCloseConfirmDialog();
        });
    }

    _handleCloseConfirmDialog() {
        this.setState({ isOpenedConfirmDialog: false });
    }

    _deletePlaceClick(placeId) {
        this.setState({
            placeToDeleteId: placeId,
            isOpenedDeleteDialog: true,
        });
    }

    /* Delete dialog */
    _handleDeletePlaceClick(e) {
        this._deletePlaceClick(e.place.id);
    }

    _handleOkDeletePlaceClick() {
        this.tourStore.removePlace(this.state.placeToDeleteId).finally(() => {
            this._closeDeleteDialog();
            this.tourStore.cancelEditingPlace();
        });
    }
    _closeDeleteDialog() {
        this.setState({ isOpenedDeleteDialog: false, placeToDeleteId: null });
    }

    /* Preview Dialog */
    _handlePreviewPlaceClick() {
        this.setState({ isOpenedPreviewDialog: true });
    }

    _closePreviewDialog() {
        this.setState({ isOpenedPreviewDialog: false });
    }

    _handleChangeImageMapClick(e) {
        this.setState({ uploadImageDialogState: TOUR_MAP });
    }

    _handleModeChanged(e) {
        this.setState({ mapEditMode: e.mode });
    }

    _handleClose() {
        if (this.tourStore.isDirty) {
            this.setState({ isOpenedConfirmDialog: true });
        } else {
            this.tourStore.cancelEditing().catch((error) => {
                console.error(error);
                this.props.rootStore.showError({
                    //TODO: move to ru.js
                    text: 'Произошла ошибка во время закрытия дизайнера',
                });
            }).finally(() => {
                this.tourStore.editingPlace = null;
            });
        }
    }

    _handleSave() {
        this.tourStore.saveChanges();
    }

    _handleNameChanged(e) {
        this.editingTour.name = e.name;
    }

    _handlePlaceNameChanged(e) {
        this.editingPlace.name = e.name;
    }

    _handleChangePlaceImage360Click(e) {
        this.setState({ uploadImageDialogState: PLACE_360 });
    }

    _handleMapClick(e) {
        if (this.editingPlace) {
            this.tourStore.saveEditingPlace(true);
            return;
        }
        if (this.editingConnection) {
            this.tourStore.saveEditingConnection(true);
            return;
        }

        if (this.state.mapEditMode === 'addPlace') {
            this.tourStore.addPlace({
                latitude: e.latitude,
                longitude: e.longitude,
            });
        }
    }

    _handlePlaceClick(e) {
        if (this.state.mapEditMode === 'dragMap') {
            this.tourStore.editPlace(e.place.id);
        } else if (this.state.mapEditMode === 'removePlace') {
            this.tourStore.removePlace(e.place.id);
        } else if (this.state.mapEditMode === 'addConnection') {
            this.tourStore.selectPlace(e.place);
        }
    }

    _handlePlaceDragend(e) {
        this.tourStore.movePlace(e.place.id, e.latitude, e.longitude);
    }

    _handleConnectionClick(e) {
        if (this.state.mapEditMode === 'dragMap') {
            this.tourStore.editConnection(e.connection.id);
        }
    }

    _renderMap() {
        if ((this.editingTour.hasMapImage && this.editingTour.mapType === 2) || this.editingTour.mapType === 1) {
            const mapStyle = this.state.mapEditMode !== 'dragMap' ? { cursor: 'pointer' } : {};
            const selectedPlaceId = this._getSelectedPlaceId();

            return <TourMap
                tour={this.editingTour}
                draggableMarkers={true}
                mapStyle={mapStyle}
                selectedPlaceId={selectedPlaceId}
                onClick={this._handleMapClick}
                onConnectionClick={this._handleConnectionClick}
                onPlaceClick={this._handlePlaceClick}
                onPlaceDragend={this._handlePlaceDragend}
            />;
        } else {
            return this._renderNoMapPlaceholder();
        }
    }

    _renderNoMapPlaceholder() {
        const { classes } = this.props;
        const { messages, formatMessage } = this.props.intl;

        return (<div className={classes.noImageMap}>
            <Typography className={classes.noImageMapPlaceholder}>{formatMessage(messages.tourDesignerNoImageMapPlaceholderFirstPart)} <PlaceholderButton onClick={this._handleChangeImageMapClick} text={formatMessage(messages.here)} /> {formatMessage(messages.tourDesignerNoImageMapPlaceholderSecondPart)}</Typography>
        </div>);
    }

    _getSelectedPlaceId() {
        if (this.editingPlace) {
            return this.editingPlace.id;
        }

        const firstPlace = this.tourStore.firstConnectionPlace;

        if (firstPlace) {
            return firstPlace.id;
        }

        return null;
    }

    _handleFileSelected(e) {
        const { uploadImageDialogState } = this.state;
        if (uploadImageDialogState === TOUR_MAP) {
            return this.tourStore.updateImageMap(e.file, e.width, e.height).then(() => {
                this.setState({ uploadImageDialogState: CLOSED });
            });
        } else if (uploadImageDialogState === PLACE_360) {
            return this.tourStore.updateImage360(e.file, e.width, e.height).then(() => {
                this.setState({ uploadImageDialogState: CLOSED });
            });
        } else if (uploadImageDialogState === PLACE_MAP_ICON) {
            return this.tourStore.updateMapIcon(e.file, e.width, e.height).then(() => {
                this.setState({ uploadImageDialogState: CLOSED });
            });
        } else {
            throw new Error("Unknown type of dialog state");
        }
    }

    render() {
        const isOpened = this.editingTour != null;
        if (!isOpened) {
            return null;
        }

        const { classes } = this.props;
        const {
            uploadImageDialogState,
            isOpenedConfirmDialog,
            isOpenedDeleteDialog,
            isOpenedPreviewDialog,
            isOpenedEditIconDialog,
            mapEditMode,
            isOpenedUploadCoverDialog,
        } = this.state;
        const { saveLoading, isDirty } = this.tourStore;
        const { messages, formatMessage } = this.props.intl;

        return (
            <Dialog
                open={true}
                fullScreen
                onClose={this._handleClose}
                TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this._handleClose} aria-label={formatMessage(messages.close)}>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.tourName}>{this.editingTour.name}</Typography>
                        <LoadingButton color={"inherit"} disabled={!isDirty} isLoading={saveLoading} onClick={this._handleSave}>{formatMessage(messages.save)}</LoadingButton>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <MapEditModeBar
                        selectedMode={mapEditMode}
                        onModeChanged={this._handleModeChanged}
                    />
                    {this._renderMap()}
                    {!this.editingTour.mapType && <Typography className={classes.map}>{formatMessage(messages.tourDesignerMapTypeError)}</Typography>}
                    {this.showEditTourPanel && <div className={classes.rightPanel}>
                        <EditTourPanel
                            tour={this.editingTour}
                            onNameChanged={this._handleNameChanged}
                            onChangeImageMapClick={this._handleChangeImageMapClick}
                            onStartPlaceChanged={this._handleStartPlaceChanged}
                            onIsPublicChanged={this._handleIsPublicChanged}
                            onViewPlaceClick={(e) => this.tourStore.viewPlaceImage360(e.place.id)}
                            onPlaceClick={(e) => this.tourStore.editPlace(e.place.id)}
                            onEditPlaceClick={(e) => this.tourStore.editPlace(e.place.id)}
                            onDeletePlaceClick={(e) => this._deletePlaceClick(e.place.id)}
                            onDescriptionChanged={(e) => this.editingTour.description = e.value}
                        />
                    </div>}
                    {this.showEditPlacePanel && <div className={classes.rightPanel}>
                        <EditPlacePanel
                            showConnections={true}
                            showWidgets={false}
                            place={this.editingPlace}
                            onNameChanged={this._handlePlaceNameChanged}
                            onChangeImage360Click={this._handleChangePlaceImage360Click}
                            onViewImage360Click={(e) => this.tourStore.viewPlaceImage360(e.place.id)}
                            onPreviewClick={this._handlePreviewPlaceClick}
                            onDeleteClick={this._handleDeletePlaceClick}
                            onConnectionClick={(e) => {
                                this.tourStore.editPlace(e.connection.placeId);
                            }}
                            onViewConnectionClick={(e) => {
                                this.tourStore.viewPlaceImage360(e.connection.placeId);
                            }}
                            onRemoveConnectionClick={(e) => {
                                this.tourStore.deleteConnection(this.editingPlace.id, e.connection.placeId)
                            }}
                            onEditConnectionClick={(e) => {
                                this.tourStore.saveEditingPlace(true).then(() => {
                                    this.tourStore.editConnection(e.connection.id);
                                });
                            }}
                            onSoundChanged={(e) => {
                                this.tourStore.updatePlaceSound(e.file);
                            }}
                            onSoundRemoved={(e) => {
                                this.tourStore.removePlaceSound(e.place.id);
                            }}
                            onDescriptionChanged={(e) => this.editingPlace.description = e.value}
                            onUploadMapIconClick={(e) => this.setState({ uploadImageDialogState: PLACE_MAP_ICON })}
                            onEditMapIconClick={(e) => this.setState({ isOpenedEditIconDialog: true })}
                            onClearMapIconClick={(e) => this.tourStore.removeMapIcon(e.place.id)}
                            onChangeCoverClick={(e) => this.setState({ isOpenedUploadCoverDialog: true })}
                        />
                    </div>}
                    {this.showEditConnectionPanel && <div className={classes.rightPanel}>
                        <EditConnectionPanel
                            connection={this.editingConnection}
                            onStartPlacePositionChanged={(e) => {
                                this.editingConnection.startPlacePosition = e.value;
                            }}
                            onEndPlacePositionChanged={(e) => {
                                this.editingConnection.endPlacePosition = e.value;
                            }}
                        ></EditConnectionPanel>
                    </div>}
                </div>
                <UploadImageDialog
                    title={formatMessage(messages.placeDesignerUploadCoverTitle)}
                    prompt={formatMessage(messages.placeDesignerUploadCoverPrompt)}
                    isOpened={isOpenedUploadCoverDialog}
                    onFileSelected={(e) => {
                        this.tourStore.updatePlaceCover(e.file, e.width, e.height).then(() => {
                            this.setState({ isOpenedUploadCoverDialog: false });
                        });
                    }}
                    onClose={() => this.setState({ isOpenedUploadCoverDialog: false })}
                />
                <UploadImageDialog
                    title={formatMessage(messages.tourDesignerUploadNewMap)}
                    prompt={formatMessage(messages.tourDesignerUploadNewMapPrompt)}
                    isOpened={uploadImageDialogState !== CLOSED}
                    onFileSelected={this._handleFileSelected}
                    onClose={() => this.setState({ uploadImageDialogState: CLOSED })}
                />
                <ConfirmDialog
                    title={formatMessage(messages.tourDesignerSaveTour)}
                    okButtonText={formatMessage(messages.save)}
                    cancelButtonText={formatMessage(messages.doNotSave)}
                    contentText={formatMessage(messages.tourDesignerSaveTourContentText)}
                    onOkClick={this._handleOkConfirmClick}
                    onCancelClick={this._handleCancelConfigrmClick}
                    isOpened={isOpenedConfirmDialog}
                    onClose={this._handleCloseConfirmDialog}
                />
                <ConfirmDialog
                    title={formatMessage(messages.tourDesignerDeletePlace)}
                    okButtonText={formatMessage(messages.yes)}
                    cancelButtonText={formatMessage(messages.no)}
                    contentText={formatMessage(messages.tourDesignerDeletePlaceContentText)}
                    onOkClick={this._handleOkDeletePlaceClick}
                    onCancelClick={this._closeDeleteDialog}
                    isOpened={isOpenedDeleteDialog}
                    onClose={this._closeDeleteDialog}
                />
                <ViewUrlDialog
                    title={formatMessage(messages.tourDesignerPreviewPlace)}
                    url={this.editingPlace && this.tourStore.getPlaceImage360Url(this.editingPlace.id)}
                    isOpened={isOpenedPreviewDialog}
                    onClose={this._closePreviewDialog}
                />
                {this.editingPlace && this.editingPlace.mapIcon && <EditIconDialog
                    title={`${formatMessage(messages.editPlaceIcon)}: ${this.editingPlace.name}`}
                    isOpened={isOpenedEditIconDialog}
                    url={this.editingPlace.mapIconUrl}
                    width={this.editingPlace.mapIcon && this.editingPlace.mapIcon.width}
                    height={this.editingPlace.mapIcon && this.editingPlace.mapIcon.height}
                    onClose={e => this.setState({ isOpenedEditIconDialog: false })}
                    onSaveClick={e => {
                        this.editingPlace.mapIcon.width = e.width;
                        this.editingPlace.mapIcon.height = e.height;
                        this.setState({ isOpenedEditIconDialog: false });
                    }}
                />}
            </Dialog>
        );
    }
}

export default withStyles(styles)(injectIntl(inject("rootStore")(observer(TourDesigner))));
