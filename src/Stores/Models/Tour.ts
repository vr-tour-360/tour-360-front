import { decorate, observable, computed, action } from "mobx";
import {
    TourDto,
} from "tour-360-backend/src/models/interfaces";
import { PlaceService } from "../../api";
import { UserStore } from "..";
import { BACKEND_URL } from "../../config";

class Tour {
    readonly id: string;
    readonly store: any;
    name: string = '';
    hasImage: boolean = false;
    filename: string = '';
    startPlaceId: string;
    isPublic: boolean;
    authorId: string;
    authorFullName: string;

    private imageHash: number = Date.now();

    constructor(store: any, id: string) {
        this.id = id;
        this.store = store;
    }

    get imageUrl() {
        return this.hasImage ? `${BACKEND_URL}${this.filename}?${this.imageHash}` : `/src/no-image.png`;
    }

    updateFromJson(json: TourDto) {
        this.name = json.name;
        this.hasImage = json.hasImage;
        this.filename = json.filename;
        this.startPlaceId = json.startPlaceId;
        this.isPublic = json.isPublic;
        this.authorId = json.authorId;
        this.authorFullName = json.authorFullName;
    }

    viewPlacePano(placeId?: string) {
        if (!placeId) {
            placeId = this.startPlaceId;
        }

        const url = PlaceService.getPanoUrl(this.id, placeId, UserStore.getToken());
        window.open(url);
    }

    refreshCover() {
        this.imageHash = Date.now();
    }
}

//TODO: cast to any to escape conflict with typings
decorate(Tour, <any>{
    name: observable,
    hasImage: observable,
    filename: observable,
    imageHash: observable,
    imageUrl: computed,
    updateFromJson: action,
    refreshCover: action,
});

export default Tour;