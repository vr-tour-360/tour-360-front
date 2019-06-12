import { decorate, observable } from "mobx";
import { ConnectionDto, PlaceDto } from "tour-360-backend/src/models/interfaces";

export default class EditConnection {
    readonly id: string;
    readonly store: any;
    readonly sessionId: string;
    startPlacePosition: string;
    endPlacePosition: string;
    startPlace: PlaceDto;
    endPlace: PlaceDto;

    constructor(store: any, sessionId: string, json: ConnectionDto) {
        this.store = store;
        this.sessionId = sessionId;
        this.id = json.id;

        this.updateFromJson(json);
    }

    updateFromJson(json: ConnectionDto) {
        this.startPlacePosition = json.startPlacePosition;
        this.endPlacePosition = json.endPlacePosition;
        this.startPlace = json.startPlace;
        this.endPlace = json.endPlace;
    }

    get asJson(): ConnectionDto {
        return {
            id: this.id,
            startPlacePosition: this.startPlacePosition,
            endPlacePosition: this.endPlacePosition,
            endPlace: this.endPlace,
            startPlace: this.startPlace,
        };
    }
}

decorate(EditConnection, <any>{
    startPlacePosition: observable,
    endPlacePosition: observable,
    startPlace: observable,
    endPlace: observable,
});
