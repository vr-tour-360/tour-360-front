import { observable, action, decorate } from "mobx";
import {
    UserStore,
    TourStore,
    TourEditStore,
    ViewTourStore,
    PlaceEditStore,
    PublicToursStore,
} from ".";

export interface MessageError {
    title?: string;
    text: string;
}

export default class RootStore {
    userStore = new UserStore(this);
    tourStore = new TourStore(this);
    tourEditStore = new TourEditStore(this);
    viewTourStore = new ViewTourStore(this);
    placeEditStore = new PlaceEditStore(this);
    publicToursStore = new PublicToursStore(this);

    error: MessageError;

    showError(error: MessageError) {
        this.error = error;
    }

    clearError() {
        this.error = null;
    }
}

decorate(RootStore, {
    error: observable,

    showError: action,
    clearError: action,
})
