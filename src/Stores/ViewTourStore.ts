import { extendObservable, decorate, observable } from 'mobx';
import { TourService } from './../api';
import { TourDetail, RootStore, EditPlace } from './../Stores';

class ViewTourStore {
    rootStore: RootStore;
    tour: TourDetail;
    selectedPlace: EditPlace;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    selectById(id: string) {
        TourService.getById(id).then((resp) => {
            this.tour = new TourDetail(resp.data.tour);
        });
    }

    selectPlaceById(id: string) {
        const place = this.tour.getPlace(id);
        this.selectedPlace = new EditPlace(place);
    }

    clearSelectedPlace() {
        this.selectedPlace = null;
    }
}

decorate(ViewTourStore, {
    tour: observable,
    selectedPlace: observable,
});

export default ViewTourStore;