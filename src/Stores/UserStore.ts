import { extendObservable, decorate, observable, computed, } from 'mobx';
import localStorage from 'mobx-localstorage';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import decode from 'jwt-decode';
import { UserService } from '../api';
import { RootStore } from "./";
import {
    UserDto
} from "tour-360-backend/src/models/interfaces";

export default class UserStore {
    signInResult: IPromiseBasedObservable<any>;
    signUpResult: IPromiseBasedObservable<any>;
    editUserResult: IPromiseBasedObservable<any>;
    getCurrentUserResult: IPromiseBasedObservable<any>;
    currentUser: UserDto;

    constructor(rootStore: RootStore) {
    }

    get signInLoading(): boolean {
        return this.signInResult && this.signInResult.state === "pending";
    }

    get singInRejected(): boolean {
        return this.signInResult && this.signInResult.state === "rejected";
    }

    get editUserLoading(): boolean {
        return this.editUserResult && this.editUserResult.state === "pending";
    }

    get siggnedIn(): boolean {
        const token = UserStore.getToken();
        return !!token;
    }

    signUp(userData: UserDto, ReCAPTCHAValue: string) {
        this.signUpResult = fromPromise(UserService.signUp(userData, ReCAPTCHAValue));
        this.signUpResult.then((resp) => {
            console.log(resp);
        });

        return this.signUpResult;
    }

    signIn(email: string, password: string, ReCAPTCHAValue: string) {
        this.signInResult = fromPromise(UserService.signIn(email, password, ReCAPTCHAValue));
        this.signInResult.then((resp) => {
            const { user, token } = resp.data;
            UserStore.setToken(token);
            this.currentUser = user;
        });

        return this.signInResult;
    }

    editUser(user: UserDto) {
        this.editUserResult = fromPromise(UserService.editUser(user));
        this.editUserResult.then((resp) => {
            this.currentUser = resp.data.user;
        });

        return this.editUserResult;
    }

    getCurrentUser() {
        if (UserStore.getCurrentUser()) {
            const id = UserStore.getCurrentUser().id;
            this.getCurrentUserResult = fromPromise(UserService.getUser(id));

            this.getCurrentUserResult.then((resp) => {
                this.currentUser = resp.data.user;
            }, () => {
                UserStore.clearToken();
            });
        } else {
            throw new Error("Current user doesn't exist.");
        }
    }

    signOut() {
        this.signInResult = null;
        UserStore.clearToken();
    }

    static getToken() {
        return localStorage.getItem('id_token');
    }

    static setToken(token) {
        localStorage.setItem('id_token', token);
    }

    static clearToken() {
        localStorage.removeItem('id_token');
    }

    static getCurrentUser(): { id: string } {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }
}


decorate(UserStore, <any>{
    signInResult: observable,
    signUpResult: observable,
    editUserResult: observable,
    getCurrentUserResult: observable,
    currentUser: observable,
    signInLoading: computed,
    singInRejected: computed,
    editUserLoading: computed,
    siggnedIn: computed,
});
