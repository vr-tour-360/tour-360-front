import client from './client';
import {
    UserDto
} from "./../../../backend/src/models/interfaces";

export function signUp(user: UserDto, ReCAPTCHAValue: string) {
    return client.post('/api/signup', { user, ReCAPTCHAValue });
}

export function signIn(email: string, password: string, ReCAPTCHAValue: string) {
    return client.post('/api/signin', { email, password, ReCAPTCHAValue });
}

export function editUser(user: UserDto) {
    return client.post('/api/editUser', user);
}

export function getUser(id: string) {
    return client.get(`/api/users/${id}`);
}
