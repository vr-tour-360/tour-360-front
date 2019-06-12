import client from './client';
import { TourEditService } from '.';
import { VR_URL } from '../config';
import {
    PlaceDetailDto,
    RunVideoWidget,
    BaseWidget,
    ImageWidget,
} from "./../../../backend/src/models/interfaces";

export function beginEditing(tourId: string, placeId: string) {
    return TourEditService.beginEditing(tourId).then((resp) => {
        const { sessionId } = resp.data.result;
        return client.post<{ sessionId: string, tourSessionId: string, place: PlaceDetailDto }>(`/api/place-edit/`, {
            tourSessionId: sessionId,
            placeId,
        });
    })
}
export function get(sessionId: string) {
    return client.get<{ sessionId: string, tourSessionId: string, place: PlaceDetailDto }>(`/api/place-edit/${sessionId}/get`);
}
export function cancelChanges(sessionId: string) {
    return client.post<{}>(`/api/place-edit/${sessionId}/cancel`);
}
export function saveChanges(sessionId: string, place: PlaceDetailDto) {
    return client.post<{ sessionId: string, tourSessionId: string, place: PlaceDetailDto }>(`/api/place-edit/${sessionId}/save`, place);
}
export function addWidget(sessionId: string, widget: BaseWidget) {
    return client.post<{
        sessionId: string,
        tourSessionId: string,
        place: PlaceDetailDto,
        widgetId: string
    }>(`/api/place-edit/${sessionId}/addWidget`, widget);
}
export function getPanoUrl(sessionId: string, placeId: string, token: string) {
    return `${VR_URL}?placeSessionId=${sessionId}&placeId=${placeId}&token=${token}`;
}
export function updateRunVideo(sessionId: string, widget: RunVideoWidget, video: File) {
    return client.post<{ widget: RunVideoWidget }>(`/api/place-edit/${sessionId}/updateRunVideo`, { widget, video }, {
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        // }
    });
}
export function updateImageWidget(sessionId: string, widgetID: string, image: File) {
    const formData = new FormData();
    formData.append('image', image);

    return client.post<{ widget: ImageWidget }>(`/api/place-edit/${sessionId}/imageWidget/${widgetID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}
export function removeImageFromImageWidget(sessionId: string, widgetID: string) {
    return client.delete(`/api/place-edit/${sessionId}/imageWidget/${widgetID}`);
}
