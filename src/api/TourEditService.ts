import client from './client';
import { AxiosPromise } from "axios";
import { VR_URL } from '../config';
import {
    PlaceDetailDto,
    ConnectionDetailDto
} from "./../../../backend/src/models/interfaces";

export function get(sessionId: string) {
    return client.get(`/api/tour-edit/${sessionId}/get`);
}
export function beginEditing(tourId: string) {
    //todo: pass tourId in body
    return client.post(`/api/tour-edit/${tourId}`);
}
export function saveChanges(sessionId: string, options: any) {
    return client.post(`/api/tour-edit/${sessionId}/save`, options);
}
export function cancelChanges(sessionId: string) {
    return client.post(`/api/tour-edit/${sessionId}/cancel`);
}
export function addPlace(sessionId: string, place: PlaceDetailDto) {
    return client.post(`/api/tour-edit/${sessionId}/addPlace`, place);
}
export function removePlace(sessionId: string, placeId: string) {
    return client.delete(`/api/tour-edit/${sessionId}/place/${placeId}`);
}
export function getPlace(sessionId: string, placeId: string) {
    return client.get(`/api/tour-edit/${sessionId}/place/${placeId}`);
}
export function updatePlace(sessionId: string, place: PlaceDetailDto) {
    return client.put(`/api/tour-edit/${sessionId}/place`, place);
}
export function addConnection(sessionId: string, startPlaceId: string, endPlaceId: string) {
    return client.post(`/api/tour-edit/${sessionId}/addConnnection`, {
        startPlaceId,
        endPlaceId,
    });
}
export function deleteConnection(sessionId: string, place1Id: string, place2Id: string) {
    return client.delete(`/api/tour-edit/${sessionId}/removeConnection/${place1Id}/${place2Id}`);
}
export function getConnection(sessionId: string, connectionId: string) {
    return client.get(`/api/tour-edit/${sessionId}/connection/${connectionId}`);
}
//TODO: use correct type
export function updateConnection(sessionId: string, connection: any/*ConnectionDetailDto*/) {
    return client.put(`/api/tour-edit/${sessionId}/connection`, connection);
}
export function uploadMapImage(sessionId: string, file, width: number, height: number) {
    const formData = new FormData();
    formData.append('mapImage', file);
    formData.append('width', String(width));
    formData.append('height', String(height));

    return client.post(`/api/tour-edit/${sessionId}/uploadMapImage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export function updateImage360(sessionId: string, placeId: string, file: File, width: number, height: number) {
    const formData = new FormData();
    formData.append('mapImage', file);
    formData.append('width', String(width));
    formData.append('height', String(height));

    return client.post(`/api/tour-edit/${sessionId}/place/${placeId}/uploadImage360`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export function updatePlaceCover(sessionId: string, placeId: string, file: File, width: number, height: number) {
    const formData = new FormData();
    formData.append('cover', file);
    formData.append('width', String(width));
    formData.append('height', String(height));

    return client.post(`/api/tour-edit/${sessionId}/place/${placeId}/uploadPlaceCover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export function uploadPlaceMapIcon(sessionId: string, placeId: string, file, width: number, height: number) {
    const formData = new FormData();
    formData.append('mapIcon', file);
    formData.append('width', String(width));
    formData.append('height', String(height));

    return client.post(`/api/tour-edit/${sessionId}/place/${placeId}/uploadMapPlaceIcon`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export function removeMapPlaceIcon(sessionId: string, placeId: string): AxiosPromise<{ place: PlaceDetailDto }> {
    return client.delete(`/api/tour-edit/${sessionId}/place/${placeId}/removeMapPlaceIcon`);
}

export function uploadPlaceSound(sessionId: string, placeId: string, file) {
    const formData = new FormData();
    formData.append('sound', file);

    return client.post(`/api/tour-edit/${sessionId}/place/${placeId}/sound`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export function removePlaceSound(sessionId: string, placeId: string) {
    return client.delete(`/api/tour-edit/${sessionId}/place/${placeId}/sound`);
}

export function getPanoUrl(sessionId: string, placeId: string, token: string, coordinates: boolean = false) {
    return `${VR_URL}?sessionId=${sessionId}&placeId=${placeId}&token=${token}${coordinates ? '&coordinates=1' : ''}`;
}
