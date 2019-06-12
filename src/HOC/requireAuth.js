import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import { Redirect } from "react-router-dom";

export default function requireAuth(WrappedComponent) {
    return inject("rootStore")(observer(
        class extends Component {
            get userStore() {
                return this.props.rootStore.userStore;
            }

            componentDidMount() {
                const { siggnedIn, currentUser } = this.userStore;

                if (siggnedIn && currentUser == null) {
                    this.userStore.getCurrentUser();
                }
            }

            render() {
                const { siggnedIn, currentUser } = this.userStore;

                if (!siggnedIn || (this.userStore.getCurrentUserResult && this.userStore.getCurrentUserResult.state === "rejected")) {
                    return <Redirect to="/sign-in" />
                }

                if (!currentUser) {
                    return null;
                }

                return <WrappedComponent {...this.props} />
            }
        }));
}