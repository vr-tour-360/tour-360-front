import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import {
    AppBar,
    Dialog,
    Toolbar,
    IconButton,
    Typography,
} from '@material-ui/core';
import {
    Close as CloseIcon,
} from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import { LoadingButton } from '..'
import { Texture, NoPlacePlaceholder, WidgetBar } from '.';
import {
    ConfirmDialog,
    UploadImageDialog,
    ViewUrlDialog,
    HtmlEditDialog,
    EditIconDialog,
} from '../Dialogs';
import EditPlacePanel from '../TourDesigner/EditPlacePanel';
import { grey } from '@material-ui/core/colors';
import { CoordinateSystem } from '.';
import {
    TextWidget,
    EditTextWidgetPanel,
    RunVideoEditPanel,
    RunVideoWidget,
    HintWidget,
    HintWidgetEditPanel,
    ImageWidget,
    ImageWidgetEditPanel
} from './Widgets';
import { HEIGHT, WIDTH } from './utils';
import { RootStore, EditPlace, PlaceEditStore } from "./../../Stores";
import {
    BaseWidget,
    TextWidget as ITextWidget,
    RunVideoWidget as IRunVideoWidget,
    HintWidget as IHintWidget,
    ImageWidget as IImageWidget
} from 'tour-360-backend/src/models/interfaces';
import { PlaceDesignerToolBarItemType } from './PlaceDesignerToolBar';
import { createError } from './Widgets/utils';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {},
    appBar: {
        position: 'relative',
    },
    tourName: {
        flex: 1,
    },
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    surfaceWrapper: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
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
    widgetArea: {
        position: 'absolute',
        top: 285,
    }
});

interface PlaceDesignerProps extends WithStyles<typeof styles> {
    rootStore: RootStore;
    match: { params: { sessionId: string } };
    intl: { formatMessage, messages };
}

interface PlaceDesignerState {
    selectedMode: PlaceDesignerToolBarItemType;
    isOpenedPreviewDialog: boolean;
    isOpenedConfirmDialog: boolean;
    isOpenedPlaceDescriptionDialog: boolean;
    uploadImageDialogOpened: boolean;
    isOpenedUploadIconMapDialog: boolean;
    isOpenedUploadCoverDialog: boolean;
    textureIsLoaded: boolean;
    isOpenedEditIconDialog: boolean;
}

const PlaceDesigner = inject("rootStore")(observer(
    class PlaceDesigner extends React.Component<PlaceDesignerProps, PlaceDesignerState> {
        surfaceWrapperRef = React.createRef<HTMLDivElement>();

        constructor(props) {
            super(props);

            this._handleClose = this._handleClose.bind(this);
            this._handleSave = this._handleSave.bind(this);
            this._handlePlaceNameChanged = this._handlePlaceNameChanged.bind(this);
            this._handleUploadImage = this._handleUploadImage.bind(this);
            this._handleFileSelected = this._handleFileSelected.bind(this);
            this._handleCloseConfirmDialog = this._handleCloseConfirmDialog.bind(this);
            this._handleCancelConfigrmClick = this._handleCancelConfigrmClick.bind(this);
            this._handleViewImage360Click = this._handleViewImage360Click.bind(this);
            this._handleTextureLoaded = this._handleTextureLoaded.bind(this);
            this._handleTextureLoading = this._handleTextureLoading.bind(this);
            this._handleWidgetClick = this._handleWidgetClick.bind(this);
            this._handleSurfaceWrapperClick = this._handleSurfaceWrapperClick.bind(this);
            this._handleOkConfirmClick = this._handleOkConfirmClick.bind(this);

            this._handlePreviewPlaceClick = this._handlePreviewPlaceClick.bind(this);
            this._closePreviewDialog = this._closePreviewDialog.bind(this);

            this._handleOpenDescriptionDialog = this._handleOpenDescriptionDialog.bind(this);
            this._handleCloseDescriptionDialog = this._handleCloseDescriptionDialog.bind(this);

            this.state = {
                selectedMode: 'selection',
                isOpenedPreviewDialog: false,
                isOpenedConfirmDialog: false,
                isOpenedPlaceDescriptionDialog: false,
                uploadImageDialogOpened: false,
                textureIsLoaded: false,
                isOpenedEditIconDialog: false,
                isOpenedUploadIconMapDialog: false,
                isOpenedUploadCoverDialog: false,
            };
        }

        get placeEditStore(): PlaceEditStore {
            return this.props.rootStore.placeEditStore;
        }

        get editingPlace(): EditPlace {
            return this.placeEditStore.editingPlace;
        }

        get editingWidget(): BaseWidget {
            return this.placeEditStore.editingWidget;
        }

        get showEditWidget(): boolean {
            return Boolean(this.editingWidget);
        }

        get showEditPlacePanel(): boolean {
            return Boolean(this.editingPlace) && !this.showEditWidget;
        }

        componentDidMount() {
            if (!this.editingPlace) {
                const sessionId = this.props.match.params.sessionId;
                const { formatMessage, messages } = this.props.intl;

                this.placeEditStore.getFromSession(sessionId)
                    .catch((error) => {
                        console.error(error);
                        this.props.rootStore.showError({
                            title: formatMessage(messages.noSessionErrorTitle),
                            text: `${formatMessage(messages.noSessionErrorText1)} ${sessionId} ${formatMessage(messages.noSessionErrorText2)}`,
                        });
                    });
            }
        }

        componentDidUpdate(prevProps, prevState) {
            if (!prevState.textureIsLoaded && this.state.textureIsLoaded) {
                const el = this.surfaceWrapperRef.current;
                this._scrollToCenter(el);
            }
        }

        _scrollToCenter(el) {
            const top = (el.scrollHeight - el.clientHeight) / 2;
            const left = (el.scrollWidth - el.clientWidth) / 2;
            el.scrollTop = top;
            el.scrollLeft = left;
        }

        _handleClose() {
            if (this.placeEditStore.isDirty) {
                this.setState({ isOpenedConfirmDialog: true });
            } else {
                this.placeEditStore.cancelEditing();
            }
        }

        _handleUploadImage() {
            this.setState({ uploadImageDialogOpened: true });
        }

        _handleFileSelected(e) {
            this.placeEditStore.updateImage360(e.file, e.width, e.height).then(() => {
                this.setState({ uploadImageDialogOpened: false });
            });
        }

        _handleSave() {
            // rename to save changes and create method to complete editing where designer will be closed
            this.placeEditStore.completeEditing();
        }

        _handleCloseConfirmDialog() {
            this.setState({ isOpenedConfirmDialog: false });
        }

        _handleOkConfirmClick() {
            this.placeEditStore.completeEditing().then(() => {
                this.placeEditStore.cancelEditing();
                this._handleCloseConfirmDialog();
            }, () => {
                this._handleCloseConfirmDialog();
            });
        }

        _handleCancelConfigrmClick() {
            this.placeEditStore.cancelEditing().finally(() => {
                this._handleCloseConfirmDialog();
            });
        }

        _handlePlaceNameChanged(e) {
            this.editingPlace.name = e.name;
        }

        _handleViewImage360Click() {
            this.placeEditStore.viewPlaceImage360(true);
        }

        _handleWidgetItemClick(e: { widget: BaseWidget }) {
            if (e.widget != null && e.widget.id) {
                //TODO: reimplement it to show widget in the center of screen
                // document.getElementById(e.widget.id).scrollIntoView();
                this.placeEditStore.editWidget(e.widget.id);
            }
        }

        _renderWidgetEditPanel() {
            if (this.editingWidget.type === 'text') {
                const widget = this.editingWidget as ITextWidget;

                return <EditTextWidgetPanel
                    key={widget.id}
                    widget={widget}
                    onXChanged={e => widget.x = e.x}
                    onYChanged={e => widget.y = e.y}
                    onContentChanged={e => widget.content = e.content}
                    onTextColorChanged={e => widget.color = e.color}
                    onTextBackgroundColorChanged={e => widget.backgroundColor = e.color}
                    onPaddingChanged={e => widget.padding = e.padding}
                    onDeleteClick={e => this.placeEditStore.deleteWidget(e.widget.id)}
                />
            } else if (this.editingWidget.type === 'run-video') {
                const widget = this.editingWidget as IRunVideoWidget;

                return <RunVideoEditPanel
                    key={widget.id}
                    widget={widget}
                    onXChanged={e => widget.x = e.value}
                    onYChanged={e => widget.y = e.value}
                    onNameChanged={e => widget.name = e.value}
                    onVolumeChanged={e => widget.volume = e.value}
                    onMutedChanged={e => widget.muted = e.value}
                    onDeleteClick={e => this.placeEditStore.deleteWidget(e.widget.id)}
                    onPanoVideoChanged={e => this.placeEditStore.updateRunVideo(e.widget, e.file)}
                    onPanoVideoRemoved={e => console.log(e)}
                />;
            } else if (this.editingWidget.type === 'hint') {
                const widget = this.editingWidget as IHintWidget;

                return <HintWidgetEditPanel
                    key={widget.id}
                    widget={widget}
                    onXChanged={e => widget.x = e.x}
                    onYChanged={e => widget.y = e.y}
                    onContentChanged={e => widget.content = e.content}
                    onDeleteClick={e => this.placeEditStore.deleteWidget(e.widget.id)}
                />;
            } else if (this.editingWidget.type === 'image') {
                const widget = this.editingWidget as IImageWidget;

                return <ImageWidgetEditPanel
                    key={widget.id}
                    widget={widget}
                    onXChanged={e => widget.x = e.value}
                    onYChanged={e => widget.y = e.value}
                    onWidthChanged={e => widget.width = e.value}
                    onHeightChanged={e => widget.height = e.value}
                    onImageSelected={e => this.placeEditStore.updateImageWidget(e.widget.id, e.file)}
                    onImageRemoved={e => this.placeEditStore.removeImageFromImageWidget(e.widget.id)}
                    onDeleteClick={e => this.placeEditStore.deleteWidget(e.widget.id)}
                />;
            }

            throw new Error("Unknown type of widget");
        }

        _renderWidget(widget: BaseWidget) {
            const isSelected = Boolean(this.editingWidget && this.editingWidget.id === widget.id);

            switch (widget.type) {
                case 'text':
                    return <TextWidget
                        key={widget.id}
                        widget={widget}
                        isSelected={isSelected}
                        onClick={this._handleWidgetClick}
                    />;
                case 'run-video':
                    return <RunVideoWidget
                        key={widget.id}
                        widget={widget}
                        isSelected={isSelected}
                        onClick={this._handleWidgetClick}
                    />
                case 'hint':
                    return <HintWidget
                        key={widget.id}
                        widget={widget}
                        isSelected={isSelected}
                        onClick={this._handleWidgetClick}
                    />
                case 'image':
                    return <ImageWidget
                        key={widget.id}
                        widget={widget}
                        isSelected={isSelected}
                        onClick={this._handleWidgetClick}
                    />
                default:
                    throw createError(widget.type)
            }

        }

        _handleWidgetClick(event) {
            this.placeEditStore.editWidget(event.widget.id);
        }

        _renderSurface() {
            const classes: any = this.props.classes;
            const { textureIsLoaded } = this.state;

            return <Texture
                onClick={this._handleTextureClick}
                imageUrl={this.editingPlace && this.editingPlace.mapImage360Url}
                onLoaded={this._handleTextureLoaded}
                onLoading={this._handleTextureLoading}>
                {textureIsLoaded && <div className={classes.widgetArea}>
                    <CoordinateSystem
                        width={WIDTH}
                        height={HEIGHT}
                        stepX={200}
                        stepY={100}
                    />
                    {this.editingPlace.widgets && this.editingPlace.widgets.map((item) => this._renderWidget(item))}
                </div>}
            </Texture>;
        }

        _handleTextureClick = (e) => {
            this.placeEditStore.completeEditWidget();

            if (this.state.selectedMode === 'selection') {
                return;
            }

            this.placeEditStore.addWidget({
                id: undefined,
                x: e.x,
                y: e.y,
                type: this.state.selectedMode,
            });
        };

        _handleTextureLoaded() {
            this.setState({ textureIsLoaded: true });
        }

        _handleTextureLoading() {
            this.setState({ textureIsLoaded: false });
        }

        _handlePreviewPlaceClick() {
            this.setState({ isOpenedPreviewDialog: true });
        }

        _closePreviewDialog() {
            this.setState({ isOpenedPreviewDialog: false });
        }

        _handleOpenDescriptionDialog() {
            this.setState({ isOpenedPlaceDescriptionDialog: true });
        }

        _handleCloseDescriptionDialog() {
            this.setState({ isOpenedPlaceDescriptionDialog: false });
        }

        _handleSurfaceWrapperClick(e) {
            this.placeEditStore.completeEditWidget();
        }

        render() {
            const { messages, formatMessage } = this.props.intl;
            const isOpened = this.editingPlace != null;
            if (!isOpened) {
                return null;
            }

            const { classes } = this.props;
            const { isDirty, saveLoading } = this.placeEditStore;
            const {
                uploadImageDialogOpened,
                isOpenedPreviewDialog,
                isOpenedConfirmDialog,
                isOpenedPlaceDescriptionDialog,
                isOpenedEditIconDialog,
                isOpenedUploadIconMapDialog,
                isOpenedUploadCoverDialog,
            } = this.state;

            return <Dialog
                open={true}
                fullScreen
                onClose={this._handleClose}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this._handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.tourName}>{this.editingPlace.name}</Typography>
                        <LoadingButton color={"inherit"} disabled={!isDirty} isLoading={saveLoading} onClick={this._handleSave}>{formatMessage(messages.save)}</LoadingButton>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    {this.editingPlace.mapImage360Url && <WidgetBar
                        selectedWidget={this.state.selectedMode}
                        onWidgetClick={(e) => this.setState({ selectedMode: e.type })}
                    />}
                    <div className={classes.surfaceWrapper} ref={this.surfaceWrapperRef} onClick={this._handleSurfaceWrapperClick}>
                        {this.editingPlace.mapImage360Url && this._renderSurface()}
                        {!this.editingPlace.mapImage360Url && <NoPlacePlaceholder onUploadClick={this._handleUploadImage} />}
                    </div>
                    {this.showEditWidget && <div className={classes.rightPanel}>
                        {this._renderWidgetEditPanel()}
                    </div>}
                    {this.showEditPlacePanel && <div className={classes.rightPanel}>
                        <EditPlacePanel
                            showWidgets={true}
                            showConnections={false}
                            place={this.editingPlace}
                            onNameChanged={this._handlePlaceNameChanged}
                            onChangeImage360Click={this._handleUploadImage}
                            onViewImage360Click={this._handleViewImage360Click}
                            onPreviewClick={this._handlePreviewPlaceClick}
                            onSoundChanged={(e) => {
                                this.placeEditStore.updatePlaceSound(e.file);
                            }}
                            onSoundRemoved={(e) => {
                                this.placeEditStore.removePlaceSound();
                            }}
                            onDescriptionClick={this._handleOpenDescriptionDialog}
                            onWidgetClick={this._handleWidgetItemClick.bind(this)}
                            onRemoveWidgetClick={e => this.placeEditStore.deleteWidget(e.widget.id)}
                            onUploadMapIconClick={(e) => this.setState({ isOpenedUploadIconMapDialog: true })}
                            onEditMapIconClick={(e) => this.setState({ isOpenedEditIconDialog: true })}
                            onClearMapIconClick={(e) => this.placeEditStore.removeMapIcon(e.place.id)}
                            onChangeCoverClick={(e) => this.setState({ isOpenedUploadCoverDialog: true })}
                        />
                    </div>}
                </div>
                <UploadImageDialog
                    title={formatMessage(messages.placeDesignerUploadPanoTitle)}
                    prompt={formatMessage(messages.placeDesignerUploadPanoPrompt)}
                    isOpened={uploadImageDialogOpened}
                    onFileSelected={this._handleFileSelected}
                    onClose={() => this.setState({ uploadImageDialogOpened: false })}
                />
                <UploadImageDialog
                    title={formatMessage(messages.uploadPlaceIconText)}
                    prompt={formatMessage(messages.uploadPlaceIconTitle)}
                    isOpened={isOpenedUploadIconMapDialog}
                    onFileSelected={(e) => {
                        this.placeEditStore.updateMapIcon(e.file, e.width, e.height).then(() => {
                            this.setState({ isOpenedUploadIconMapDialog: false });
                        });
                    }}
                    onClose={() => this.setState({ isOpenedUploadIconMapDialog: false })}
                />
                <UploadImageDialog
                    title={formatMessage(messages.placeDesignerUploadCoverTitle)}
                    prompt={formatMessage(messages.placeDesignerUploadCoverPrompt)}
                    isOpened={isOpenedUploadCoverDialog}
                    onFileSelected={(e) => {
                        this.placeEditStore.updatePlaceCover(e.file, e.width, e.height).then(() => {
                            this.setState({ isOpenedUploadCoverDialog: false });
                        });
                    }}
                    onClose={() => this.setState({ isOpenedUploadCoverDialog: false })}
                />
                <ViewUrlDialog
                    title={formatMessage(messages.tourDesignerPreviewPlace)}
                    url={this.placeEditStore.getPlaceImage360Url()}
                    isOpened={isOpenedPreviewDialog}
                    onClose={this._closePreviewDialog}
                />
                <ConfirmDialog
                    title={formatMessage(messages.placeDesignerSaveDialogTitle)}
                    okButtonText={formatMessage(messages.save)}
                    cancelButtonText={formatMessage(messages.doNotSave)}
                    contentText={formatMessage(messages.placeDesignerConfirmMessage)}
                    onOkClick={this._handleOkConfirmClick}
                    onCancelClick={this._handleCancelConfigrmClick}
                    isOpened={isOpenedConfirmDialog}
                    onClose={this._handleCloseConfirmDialog}
                />
                <HtmlEditDialog
                    title={formatMessage(messages.tourDesignerEditPlaceDescription)}
                    htmlContent={this.editingPlace.description}
                    isOpened={isOpenedPlaceDescriptionDialog}
                    onClose={this._handleCloseDescriptionDialog}
                    onSaveClick={(e) => {
                        this.editingPlace.description = e.htmlContent;
                        this._handleCloseDescriptionDialog();
                    }}
                />
                {this.editingPlace && this.editingPlace.mapIcon && this.editingPlace.mapIcon.filename && <EditIconDialog
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
        }
    }));


export default withStyles(styles)(injectIntl(PlaceDesigner));