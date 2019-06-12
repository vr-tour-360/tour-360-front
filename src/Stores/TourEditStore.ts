import { extendObservable, decorate, computed, observable, action, runInAction } from 'mobx';
import { deepObserve, fromPromise, IDisposer } from 'mobx-utils';
import { TourEditService } from '../api';
import {
    TourDetail,
    EditPlace,
    EditConnection,
    UserStore,
    RootStore,
} from './';
import { PlaceDto, PlaceDetailDto } from '../../../backend/src/models/interfaces';

export default class TourEditStore {
    readonly rootStore: RootStore;
    editingTourDisposer: IDisposer;
    editingPlaceDisposer: IDisposer;
    editingConnectionDisposer: IDisposer;

    saveResult: any;

    editingTour: TourDetail;
    editingPlace: EditPlace;
    editingConnection: EditConnection;
    sessionId: string;
    firstConnectionPlace: PlaceDto;
    isDirty: boolean;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    get saveLoading() {
        return this.saveResult && this.saveResult.state === "pending";
    }

    getFromSession(sessionId: string) {
        return TourEditService.get(sessionId).then((resp) => {
            const { tour } = resp.data;

            runInAction(() => {
                this._updateEditingTour(sessionId, tour);
            });

            return this.editingTour;
        });
    }

    beginEditing(tourId: string) {
        return TourEditService.beginEditing(tourId).then((resp) => {
            const { tour, sessionId } = resp.data.result;

            runInAction(() => {
                this._updateEditingTour(sessionId, tour);
            });

            return sessionId;
        });
    }

    editPlace(placeId: string) {
        this._clearEditingConnection();
        return TourEditService.getPlace(this.sessionId, placeId).then((resp) => {
            const { place } = resp.data;
            runInAction(() => {
                this.editingPlace = new EditPlace(place);
                this.editingPlaceDisposer = deepObserve(this.editingPlace, () => this.isDirty = true);
            });
        });
    }

    selectPlace(place: PlaceDto) {
        if (this.firstConnectionPlace) {
            if (this.editingTour.hasConnection(this.firstConnectionPlace.id, place.id)) {
                this.firstConnectionPlace = null;
                return;
            }

            TourEditService.addConnection(this.sessionId, this.firstConnectionPlace.id, place.id).then((resp) => {
                const { tour } = resp.data;
                this.editingTour.updateFromJson(tour);
                this.firstConnectionPlace = null;
            });
        } else {
            runInAction(() => this.firstConnectionPlace = place);
        }
    }

    deleteConnection(place1Id: string, place2Id: string) {
        return TourEditService.deleteConnection(this.sessionId, place1Id, place2Id).then((resp) => {
            const { tour } = resp.data;

            runInAction(() => {
                this.editingTour.updateFromJson(tour);

                if (this.editingPlace) {
                    TourEditService.getPlace(this.sessionId, this.editingPlace.id).then((resp) => {
                        const { place } = resp.data;
                        this.editingPlace && this.editingPlace.updateFromJson(place);
                    });
                }
            });
        });
    }

    editConnection(connectionId: string) {
        this._clearEditingPlace();
        return TourEditService.getConnection(this.sessionId, connectionId).then(((resp) => {
            runInAction(() => {
                this.editingConnection = new EditConnection(this, this.sessionId, resp.data.connection);
                this.editingConnectionDisposer = deepObserve(this.editingConnection, () => this.isDirty = true);
            });
        }));
    }

    saveEditingPlace(cancel = false) {
        return this._updatePlaceOnServer(this.editingPlace.asJson, cancel);
    }

    movePlace(placeId: string, latitude: number, longitude: number) {
        const place = this.editingTour.getPlace(placeId);
        place.latitude = latitude;
        place.longitude = longitude;

        this._updatePlaceOnServer(place, false);
    }

    cancelEditingPlace() {
        this._clearEditingPlace();
    }

    saveEditingConnection(cancel = false) {
        return TourEditService.updateConnection(this.sessionId, this.editingConnection.asJson).then((resp) => {
            const { connection } = resp.data;

            runInAction(() => {
                this.editingTour.updateConnectionFromJson(connection);

                if (cancel) {
                    this._clearEditingConnection();
                } else {
                    this.editingConnection.updateFromJson(connection);
                }
            });
        });
    }

    cancelEditing() {
        return TourEditService.cancelChanges(this.sessionId).then(action(() => {
            this.editingTour = null;
            this._clearEditingPlace();
            this.isDirty = false;
            this.editingTourDisposer && this.editingTourDisposer();
        }));
    }

    saveChanges() {
        this.editingPlace && this.editingTour.updatePlaceFromJson(this.editingPlace.asJson);
        this.editingConnection && this.editingTour.updateConnectionFromJson(this.editingConnection.asJson);

        this.saveResult = fromPromise(TourEditService.saveChanges(this.sessionId, {
            name: this.editingTour.name,
            startPlaceId: this.editingTour.startPlaceId,
            isPublic: this.editingTour.isPublic,
            description: this.editingTour.description,
        }));

        this.saveResult.then(action((result) => {
            this.editingTour.updateFromJson(result.data.tour);
            this.isDirty = false;
        }));

        return this.saveResult;
    }

    updateImageMap = action((file: File, width: number, height: number) => {
        return TourEditService.uploadMapImage(this.sessionId, file, width, height).then((resp) => {
            runInAction(() => {
                this.editingTour.updateFromJson(resp.data.tour);
                this.editingTour.refreshCover();
            });
        });
    })

    updatePlaceCover(file: File, width: number, height: number) {
        return TourEditService.updatePlaceCover(this.sessionId, this.editingPlace.id, file, width, height).then((resp) => {
            const { place } = resp.data;

            runInAction(() => {
                this.editingTour.updatePlaceFromJson(place);
                this.editingPlace && this.editingPlace.updateFromJson(place);
            });
        });
    }

    updateImage360(file: File, width: number, height: number) {
        return TourEditService.updateImage360(this.sessionId, this.editingPlace.id, file, width, height).then((resp) => {
            const { place } = resp.data;

            runInAction(() => {
                this.editingTour.updatePlaceFromJson(place);
                this.editingPlace && this.editingPlace.updateFromJson(place);
            });
        });
    }

    updateMapIcon(file: File, width: number, height: number) {
        return TourEditService.uploadPlaceMapIcon(this.sessionId, this.editingPlace.id, file, width, height).then(resp => {
            const place = resp.data.place;

            runInAction(() => {
                this.editingTour.updatePlaceFromJson(place);
                this.editingPlace && this.editingPlace.updateFromJson(place);
            });
        });
    }

    removeMapIcon(placeId: string) {
        return TourEditService.removeMapPlaceIcon(this.sessionId, placeId).then(resp => {
            const { place } = resp.data;
            runInAction(() => {
                this.editingTour.updatePlaceFromJson(place);
                this.editingPlace && this.editingPlace.updateFromJson(place);
            });
        });
    }

    updatePlaceSound(soundFile: File) {
        return TourEditService.uploadPlaceSound(this.sessionId, this.editingPlace.id, soundFile).then((resp) => {
            const place = resp.data.place;
            runInAction(() => {
                this.editingTour.updatePlaceFromJson(place);
                this.editingPlace && this.editingPlace.updateFromJson(place);
            });
        });
    }

    removePlaceSound(placeId: string) {
        return TourEditService.removePlaceSound(this.sessionId, placeId).then((resp) => {
            const place = resp.data.place;
            runInAction(() => {
                this.editingTour.updatePlaceFromJson(place);
                this.editingPlace && this.editingPlace.updateFromJson(place);
            });
        });
    }

    addPlace(place) {
        return TourEditService.addPlace(this.sessionId, place).then((resp) => {
            runInAction(() => {
                this.editingTour.updateFromJson(resp.data.tour);
            });
        });
    }

    removePlace(id: string) {
        return TourEditService.removePlace(this.sessionId, id).then((resp) => {
            runInAction(() => {
                this.editingTour.updateFromJson(resp.data.tour);
            });
        });
    }

    viewPlaceImage360(placeId: string) {
        window.open(this.getPlaceImage360Url(placeId));
    }

    getPlaceImage360Url(placeId: string) {
        return TourEditService.getPanoUrl(this.sessionId, placeId, UserStore.getToken());
    }

    _clearEditingPlace() {
        this.editingPlace = null;
        this.editingPlaceDisposer && this.editingPlaceDisposer();
    }

    _clearEditingConnection() {
        this.editingConnection = null;
        this.editingConnectionDisposer && this.editingConnectionDisposer();
    }

    _clearEditingTour() {
        this.editingTour = null;
        this.editingTourDisposer && this.editingTourDisposer();
    }

    _updateEditingTour = action((sessionId: string, tour) => {
        this.editingTour = new TourDetail(tour);
        this.isDirty = false;

        this.editingTourDisposer = deepObserve(this.editingTour, () => this.isDirty = true);

        this.sessionId = sessionId;
    });

    _updatePlaceOnServer(json: PlaceDetailDto, cancel = false) {
        return TourEditService.updatePlace(this.sessionId, json).then((resp) => {
            const { place } = resp.data;

            runInAction(() => {
                this.editingTour.updatePlaceFromJson(place);

                if (cancel) {
                    this._clearEditingPlace();
                } else {
                    this.editingPlace && this.editingPlace.updateFromJson(place);
                }
            })
        });
    }
}

decorate(TourEditStore, <any>{
    saveResult: observable,

    editingTour: observable,
    editingPlace: observable,
    editingConnection: observable,
    sessionId: observable,
    firstConnectionPlace: observable,
    isDirty: observable,

    saveLoading: computed,
});
