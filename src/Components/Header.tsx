import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    Typography,
    IconButton,
    Tooltip,
    Button,
} from '@material-ui/core';
import {
    AccountCircle as AccountCircleIcon,
    Map as MapIcon,
} from '@material-ui/icons';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import { Redirect, RouteComponentProps } from "react-router";
import { intlShape, injectIntl } from 'react-intl'
import { RootStore } from './../Stores';

const styles = createStyles({
    root: {
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    icon: {
        color: 'white',
    }
});

interface HeaderProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
    //TODO: to fix heroku build
    location: any;
    rootStore: RootStore;
    title: string;
    intl: any;
}

interface HeaderState {
    anchorEl: HTMLElement;
    redirectToProfile: boolean;
    redirectToPublicTours: boolean;
    redirectToMyTours: boolean;
    redirectToLogin: boolean;
}
class Header extends React.Component<HeaderProps, HeaderState> {
    state = {
        anchorEl: null,
        redirectToProfile: false,
        redirectToPublicTours: false,
        redirectToMyTours: false,
        redirectToLogin: false,
    };

    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    get userStore() {
        return this.props.rootStore.userStore;
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleSignOut = () => {
        this.userStore.signOut();
    };

    handleOpenProfile = () => {
        this.setState({ redirectToProfile: true });
    };

    render() {
        const { classes, title } = this.props;
        const { anchorEl, redirectToProfile, redirectToPublicTours, redirectToMyTours, redirectToLogin } = this.state;
        const { messages, formatMessage } = this.props.intl;
        const auth = this.userStore.siggnedIn;
        const open = Boolean(anchorEl);
        const isPublicTours = this.props.location.pathname.startsWith('/public-tours');
        const isTours = this.props.location.pathname.startsWith('/tours');
        const isSignIn = this.props.location.pathname.startsWith('/sign-in');

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>{title}</Typography>
                        <div>
                            {!isPublicTours && <Button className={classes.icon} onClick={() => this.setState({ redirectToPublicTours: true })}>
                                {formatMessage(messages.headerPublicTours)}
                                <MapIcon />
                            </Button>}
                            {!isTours && auth && <Button className={classes.icon} onClick={() => this.setState({ redirectToMyTours: true })}>
                                {formatMessage(messages.headerMyTours)}
                                <MapIcon />
                            </Button>}
                            {!auth && !isSignIn && <Button className={classes.icon} onClick={() => this.setState({ redirectToLogin: true })}>
                                {formatMessage(messages.signInPageButtonTitle)}
                            </Button>}
                            {auth && (
                                <>
                                    <IconButton
                                        className={classes.icon}
                                        aria-owns={open ? 'menu-appbar' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={open}
                                        onClose={this.handleClose}
                                    >
                                        <MenuItem onClick={this.handleOpenProfile}>{formatMessage(messages.headerMyAccount)}</MenuItem>
                                        <MenuItem onClick={this.handleSignOut}>{formatMessage(messages.headerSignOut)}</MenuItem>
                                    </Menu>
                                </>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>
                {redirectToProfile && <Redirect to='/profile' />}
                {redirectToPublicTours && <Redirect to='/public-tours' />}
                {redirectToMyTours && <Redirect to='/tours' />}
                {redirectToLogin && <Redirect to='/sign-in' />}
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(withRouter(inject("rootStore")(
    observer(Header)))
));