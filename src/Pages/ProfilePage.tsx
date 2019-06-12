import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles, Theme, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import {
    TextField,
    Typography,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
    Input,
} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { LoadingButton } from '../Components';
import { PageWrapper } from '../Components/Common';
import { requireAuth } from '../HOC';
import { validEmail, validName } from '../utils/validate.js';
import { intlShape, injectIntl } from 'react-intl';
import { RootStore } from './../Stores';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panel: {
        display: 'flex',
        flexDirection: 'column',
        width: '400px',
        backgroundColor: grey[100],
        border: `1px solid ${grey[300]}`,
        padding: '30px 50px',
        borderRadius: 5,
    },
    registerLink: {
        alignSelf: 'flex-end',
    },
});

interface ProfilePageProps extends WithStyles<typeof styles> {
    intl: any;
    rootStore: RootStore;
}

interface ProfilePageState {
    email: string;
    firstName: string;
    lastName: string;
    language: string;

    isLastNameValid: boolean;
    isEmailValid: boolean;
    isFirstNameValid: boolean;

    emailError: string;
    firstNameError: string;
    lastNameError: string;
}

const ProfilePage = requireAuth(inject("rootStore")(observer(
    class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
        constructor(props) {
            super(props);

            this.state = {
                email: this.userStore.currentUser.email,
                isEmailValid: true,
                emailError: '',

                firstName: this.userStore.currentUser.firstName,
                isFirstNameValid: true,
                firstNameError: '',

                lastName: this.userStore.currentUser.lastName,
                isLastNameValid: true,
                lastNameError: '',

                language: this.userStore.currentUser.language || 'Русский',
            };

            this._handleEmailChanged = this._handleEmailChanged.bind(this);
            this._handleFirstNameChanged = this._handleFirstNameChanged.bind(this);
            this._handleLastNameChanged = this._handleLastNameChanged.bind(this);
            this._handleLanguageChanged = this._handleLanguageChanged.bind(this);
            this._handleSave = this._handleSave.bind(this);
        }

        static propTypes = {
            classes: PropTypes.object.isRequired,

            intl: intlShape.isRequired,
        };

        get userStore() {
            return this.props.rootStore.userStore;
        }

        _handleEmailChanged(e) {
            const { value } = e.target;
            const { valid, error } = validEmail(value);
            this.setState({ email: value, isEmailValid: valid, emailError: error });
        }

        _handleFirstNameChanged(e) {
            const { value } = e.target;
            const { valid, error } = validName(value);
            this.setState({ firstName: value, isFirstNameValid: valid, firstNameError: error });
        }

        _handleLastNameChanged(e) {
            const { value } = e.target;
            const { valid, error } = validName(value);
            this.setState({ lastName: value, isLastNameValid: valid, lastNameError: error });
        }

        _handleSave() {
            this.userStore.editUser({
                id: undefined,
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                language: this.state.language,
            }).then((result) => {
                this.setState({
                    email: result.data.user.email,
                    firstName: result.data.user.firstName,
                    lastName: result.data.user.lastName,
                });
            });
        }

        _handleLanguageChanged(e) {
            this.setState({ language: e.target.value });
        }

        render() {
            const { classes } = this.props;
            const {
                email,
                isEmailValid,
                emailError,
                firstName,
                isFirstNameValid,
                firstNameError,
                lastName,
                isLastNameValid,
                lastNameError,
                language,
            } = this.state;

            const { messages, formatMessage } = this.props.intl;

            const languages = ['Русский', 'English'];

            return <PageWrapper title={"Your profile"}>
                <div className={classes.root}>
                    <div className={classes.panel}>
                        <Typography align="center" variant="h5" title="Profile">{formatMessage(messages.profilePageTitle)}</Typography>
                        <TextField
                            label={formatMessage(messages.email)}
                            value={email}
                            inputProps={{ type: 'email' }}
                            onChange={this._handleEmailChanged}
                            margin="normal"
                            error={!isEmailValid}
                            helperText={emailError}
                            fullWidth={true}
                            required
                            autoFocus
                        />
                        <TextField
                            label={formatMessage(messages.firstName)}
                            value={firstName}
                            onChange={this._handleFirstNameChanged}
                            margin="normal"
                            error={!isFirstNameValid}
                            helperText={firstNameError}
                            fullWidth={true}
                            required
                            autoFocus
                        />
                        <TextField
                            label={formatMessage(messages.lastName)}
                            value={lastName}
                            onChange={this._handleLastNameChanged}
                            margin="normal"
                            error={!isLastNameValid}
                            helperText={lastNameError}
                            fullWidth={true}
                            required
                            autoFocus
                        />
                        <FormControl fullWidth>
                            <InputLabel htmlFor="name-disabled">{formatMessage(messages.language)}</InputLabel>
                            <Select
                                variant="filled"
                                fullWidth={true}
                                onChange={this._handleLanguageChanged}
                                input={<Input name="language" />}
                                value={language}>
                                {languages.map(language => <MenuItem key={language} value={language}>{language}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Link className={classes.registerLink} to="/tours">{formatMessage(messages.profilePageToTours)}</Link>
                        <LoadingButton
                            style={{ marginTop: '15px' }}
                            isLoading={this.userStore.editUserLoading}
                            disabled={this.userStore.editUserLoading || !isEmailValid || !isFirstNameValid || !isLastNameValid}
                            onClick={this._handleSave}
                        >{formatMessage(messages.save)}</LoadingButton>
                    </div>
                </div >
            </PageWrapper>;
        }
    }
)));

export default withStyles(styles)(injectIntl(ProfilePage));