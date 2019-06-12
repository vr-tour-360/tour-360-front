import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, createStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import { Add, Edit, Delete, Visibility, Map } from '@material-ui/icons';
import { observer, inject } from 'mobx-react';
import { Route } from "react-router-dom";
import { requireAuth } from '../HOC';
import { Header, Tours, ViewTourPanel, NoToursPlaceholder } from '../Components';
import { PageWrapper } from "./../Components/Common";
import { CreateTourDialog, UploadImageDialog } from '../Components/Dialogs';
import TourDesigner from '../Components/TourDesigner/TourDesigner';
import { PlaceDesigner } from '../Components/PlaceDesigner';
import { RootStore, TourStore, TourEditStore } from './../Stores';

const styles: StyleRulesCallback = (theme: Theme) => ({
    addTour: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
    },
    toursWrapper: {
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '12px',
        flexGrow: 1,
    }
});

interface ToursPageProps extends WithStyles<typeof styles> {
    rootStore: RootStore;
    intl: any;
}

interface ToursPageState {
    isOpenedCreateDialog: boolean;
    isOpenedUploadImageDialog: boolean;
    newTourName: string;
    newTourMapType: 1;
    mapTypes: number[];
}

class ToursPage extends React.Component<ToursPageProps, ToursPageState> {
    constructor(props) {
        const { messages, formatMessage } = props.intl;

        super(props);

        this.state = {
            isOpenedCreateDialog: false,
            isOpenedUploadImageDialog: false,
            newTourName: '',
            newTourMapType: 1,
            mapTypes: [1, 2],
        } as ToursPageState;

        this._handleOnAddClick = this._handleOnAddClick.bind(this);
        this._handleOnCreateClick = this._handleOnCreateClick.bind(this);
        this._handleNameChanged = this._handleNameChanged.bind(this);
        this._handleTourItemClick = this._handleTourItemClick.bind(this);
        this._handleImageChangeClick = this._handleImageChangeClick.bind(this);
        this._handleFileSelected = this._handleFileSelected.bind(this);
        this._handleMapTypeChanged = this._handleMapTypeChanged.bind(this);
        this._handleViewPlace = this._handleViewPlace.bind(this);
        this._handleEditPlace = this._handleEditPlace.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,

        intl: intlShape.isRequired,
    };

    get store(): TourStore {
        return this.props.rootStore.tourStore;
    }

    get editStore(): TourEditStore {
        return this.props.rootStore.tourEditStore;
    }

    componentDidMount() {
        this.store.loadTours();
    }

    _handleFileSelected(e) {
        this.store.updateCover(this.store.selectedTour.id, e.file).then(() => {
            this.setState({ isOpenedUploadImageDialog: false });
        });
    }

    _handleTourItemClick(e) {
        this.store.selectTour(e.tour.id);
    }

    _handleOnAddClick() {
        this.setState({
            isOpenedCreateDialog: true,
            newTourName: `New Tour ${this.store.tours.length + 1}`,
        });
    }

    _handleOnCreateClick(event) {
        this.setState({ isOpenedCreateDialog: false });
        this.store.create(this.state.newTourName, this.state.newTourMapType);
    }

    _handleNameChanged(event) {
        this.setState({ newTourName: event.name });
    }

    _handleMapTypeChanged(event) {
        this.setState({ newTourMapType: event.mapType.value });
    }

    _handleImageChangeClick(event) {
        this.setState({ isOpenedUploadImageDialog: true });
        console.log(event);
    }

    _handleEditPlace(e, history) {
        this.props.rootStore.placeEditStore.beginEditing(e.tour.id, e.place.id).then((sessionId) => {
            history.push(`/tours/edit-place/${sessionId}`);
        });
    }

    _handleViewPlace(e) {
        this.store.viewPlacePano(e.tour.id, e.place.id);
    }

    _getActionsForTour(e, history) {
        const { messages, formatMessage } = this.props.intl;

        const actions = [{
            icon: <Edit />,
            text: formatMessage(messages.edit),
            action: (e) => {
                this.editStore.beginEditing(e.tour.id).then((sessionId) => {
                    history.push(`/tours/edit-tour/${sessionId}`);
                });
            }
        }, {
            icon: <Delete />,
            text: formatMessage(messages.delete),
            action: (e) => {
                this.store.delete(e.tour.id);
            }
        }, {
            icon: <Map />,
            text: formatMessage(messages.toursPageTourMap),
            action: (e) => {
                this.store.viewMap(e.tour.id);
            }
        }];

        if (e.tour.startPlaceId) {
            actions.push({
                icon: <Visibility />,
                text: formatMessage(messages.view),
                action: (e) => {
                    this.store.viewPlacePano(e.tour.id);
                }
            });
        }

        return actions;
    }

    render() {
        const { messages, formatMessage } = this.props.intl;
        const { classes } = this.props;
        const { isOpenedCreateDialog, isOpenedUploadImageDialog, mapTypes, newTourMapType } = this.state;
        const { selectedTour, tours, hasTours } = this.store;

        return (
            <PageWrapper title={formatMessage(messages.headerTitle)}>
                <>
                    <CreateTourDialog
                        name={this.state.newTourName}
                        mapTypes={mapTypes}
                        mapTypeValue={newTourMapType}
                        isOpened={isOpenedCreateDialog}
                        onCreateClick={this._handleOnCreateClick}
                        onNameChanged={this._handleNameChanged}
                        onMapTypeChanged={this._handleMapTypeChanged}
                        onClose={() => this.setState({ isOpenedCreateDialog: false })}
                    />
                    <UploadImageDialog
                        title={formatMessage(messages.toursPageUploadCoverDialogTitle)}
                        prompt={formatMessage(messages.toursPageUploadCoverDialogPrompt)}
                        isOpened={isOpenedUploadImageDialog}
                        onFileSelected={this._handleFileSelected}
                        onClose={() => this.setState({ isOpenedUploadImageDialog: false })}
                    />
                    <div className={classes.content}>
                        <div className={classes.toursWrapper}>
                            {hasTours && <Route render={({ history }) => (
                                <Tours
                                    selectedTourId={selectedTour && selectedTour.id}
                                    tours={tours}
                                    onItemClick={this._handleTourItemClick}
                                    getActions={(e) => this._getActionsForTour(e, history)}
                                />)} />}
                            {!hasTours && <NoToursPlaceholder onAddClick={this._handleOnAddClick} />}
                            <Fab color="secondary" className={classes.addTour} onClick={this._handleOnAddClick} >
                                <Add />
                            </Fab>
                        </div>
                        {selectedTour && <Route render={({ history }) => (
                            <ViewTourPanel
                                width={`${window.innerWidth * 0.25}px`}
                                tour={selectedTour}
                                onImageChangeClick={this._handleImageChangeClick}
                                onViewPlaceClick={this._handleViewPlace}
                                onEditPlaceClick={(e) => this._handleEditPlace(e, history)} />
                        )} />}
                        <Route path="/tours/edit-tour/:sessionId" component={TourDesigner} />
                        <Route path="/tours/edit-place/:sessionId" component={PlaceDesigner} />
                    </div>
                </>
            </PageWrapper>
        );
    }
}

export default withStyles(styles)(
    injectIntl(
        requireAuth(
            inject("rootStore")(observer(ToursPage))
        )
    )
);