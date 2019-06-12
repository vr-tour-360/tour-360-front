import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import { Redirect } from "react-router-dom";

export default function redirectWhenAuth(WrappedComponent) {
    return inject("rootStore")(observer(
        class extends Component {
            get userStore() {
                return this.props.rootStore.userStore;
            }

            render() {
                const { siggnedIn } = this.userStore;

                if (siggnedIn) {
                    return <Redirect to="/tours" />
                }

                return <WrappedComponent {...this.props} />
            }
        }))
}
