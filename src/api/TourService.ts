import client from './client';
import {
    TourDto,
    TourDetailDto,
} from "tour-360-backend/src/models/interfaces";

export function getAllPublic() {
    return client.get<{ tours: TourDto[] }>("/api/public-tours");
}
export function getAll() {
    return client.get<{ tours: TourDto[] }>("/api/tour");
}
export function getById(id: string) {
    return client.get<{ tour: TourDetailDto }>(`/api/tour/${id}`);
}
export function create(name: string, mapType: number) {
    return client.post<{ tour: TourDetailDto }>('/api/tour', { name, mapType });
}
export function deleteById(id: string) {
    return client.delete(`/api/tour/${id}`);
}
export function uploadCover(id: string, file) {
    const formData = new FormData();
    formData.append('cover', file);

    return client.post<{ tour: TourDetailDto }>(`/api/tour/${id}/cover`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}