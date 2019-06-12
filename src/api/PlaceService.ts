import { VR_URL } from '../config';

export function getPanoUrl(tourId: string, placeId: string, token: string) {
    return `${VR_URL}?tourId=${tourId}&placeId=${placeId}&token=${token}`;
}
