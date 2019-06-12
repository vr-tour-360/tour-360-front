import { extendObservable } from "mobx";
import { BACKEND_URL } from "../../config";

export default class PlaceDesignerModel {
    readonly id: string;
    name: string;
    hasImage360: false;
    image360Width: number;
    image360Height: number;
    image360Name: string;
    
    private image360Hash: number;

    constructor(json) {
        this.id = json.id;

        extendObservable(this, {
            name: '',
            hasImage360: false,
            image360Hash: Date.now(),
            image360Name: '',
            image360Width: 0,
            image360Height: 0,
            get mapImage360Url() {
                return this.hasImage360 ? `${BACKEND_URL}${this.image360Name}?${this.image360Hash}` : null;
            },
        });

        this.updateFromJson(json);
    }

    updateFromJson(json) {
        this.name = json.name;
        this.hasImage360 = json.hasImage360;
        this.image360Width = json.image360Width;
        this.image360Height = json.image360Height;
        this.image360Name = json.image360Name;

        if (this.image360Name !== json.image360Name) {
            this.image360Hash = Date.now();
        }
    }
}
