import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import {
    FormControlLabel,
    TextField,
    Button,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
    Input,
    Checkbox,
} from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import { PlaceList } from './../';
import { TourDetail } from '../../Stores';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        flex: 1,
        padding: theme.spacing.unit * 2,
    },
    description: {
        backgroundColor: 'white',
        marginBottom: theme.spacing.unit,
    }
});

interface EditTourPanelProps extends WithStyles<typeof styles> {
    tour: TourDetail;
    startPlaceId: string;
    onNameChanged: (e: { origin: EditTourPanel, name: string }) => void;
    onChangeImageMapClick: (e: { origin: EditTourPanel }) => void;
    onStartPlaceChanged: (e: { origin: EditTourPanel, startPlaceId: string }) => void;
    onIsPublicChanged: (e: { origin: EditTourPanel, isPublic: boolean }) => void;
    onViewPlaceClick: (e: { origin: EditTourPanel, place }) => void;
    onEditPlaceClick: (e: { origin: EditTourPanel, place }) => void;
    onDeletePlaceClick: (e: { origin: EditTourPanel, place }) => void;
    onPlaceClick: (e: { origin: EditTourPanel, place }) => void;
    onDescriptionChanged: (e: { origin: EditTourPanel, value: string }) => void;

    intl: intlShape.isRequired;
}

class EditTourPanel extends React.Component<EditTourPanelProps> {
    constructor(props) {
        super(props);

        this._handleNameChanged = this._handleNameChanged.bind(this);
        this._handleChangeImageMapClick = this._handleChangeImageMapClick.bind(this);
        this._handleStartPlaceChanged = this._handleStartPlaceChanged.bind(this);
        this._handleIsPublicChanged = this._handleIsPublicChanged.bind(this);
        this._handlePlaceClick = this._handlePlaceClick.bind(this);
        this._handleViewPlaceClick = this._handleViewPlaceClick.bind(this);
        this._handleEditPlaceClick = this._handleEditPlaceClick.bind(this);
        this._handleDeletePlaceClick = this._handleDeletePlaceClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        tour: PropTypes.shape({
            name: PropTypes.string.isRequired,
            places: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            })),
        }).isRequired,
        startPlaceId: PropTypes.string,
        onNameChanged: PropTypes.func.isRequired,
        onChangeImageMapClick: PropTypes.func.isRequired,
        onStartPlaceChanged: PropTypes.func.isRequired,
        onIsPublicChanged: PropTypes.func.isRequired,
        onViewPlaceClick: PropTypes.func.isRequired,
        onEditPlaceClick: PropTypes.func.isRequired,
        onDeletePlaceClick: PropTypes.func.isRequired,
        onPlaceClick: PropTypes.func.isRequired,
        onDescriptionChanged: PropTypes.func.isRequired,

        intl: intlShape.isRequired,
    }

    _handleNameChanged(e) {
        this.props.onNameChanged({
            origin: this,
            name: e.target.value,
        });
    }

    _handleChangeImageMapClick(e) {
        this.props.onChangeImageMapClick({ origin: this });
    }

    _handleStartPlaceChanged(e) {
        this.props.onStartPlaceChanged({ origin: this, startPlaceId: e.target.value });
    }

    _handleIsPublicChanged(e) {
        this.props.onIsPublicChanged({ origin: this, isPublic: e.target.checked });
    }

    _handlePlaceClick(e) {
        this.props.onPlaceClick({ origin: this, place: e.place });
    }

    _handleViewPlaceClick(e) {
        this.props.onViewPlaceClick({ origin: this, place: e.place, });
    }

    _handleEditPlaceClick(e) {
        this.props.onEditPlaceClick({ origin: this, place: e.place, });
    }

    _handleDeletePlaceClick(e) {
        this.props.onDeletePlaceClick({ origin: this, place: e.place });
    }

    _handleChangeDescription = (e) => {
        this.props.onDescriptionChanged({ origin: this, value: e.target.value });
    };

    render() {
        const { classes, tour } = this.props;
        // const places = tour.places || [];
        const { places = [], startPlaceId = "" } = tour;
        const { messages, formatMessage } = this.props.intl;

        return (<div className={classes.root}>
            <TextField
                label={formatMessage(messages.editTourPanelTourName)}
                value={tour.name}
                onChange={this._handleNameChanged}
                margin="normal"
                fullWidth={true}
                autoFocus
            />
            <Button fullWidth variant="text" color="primary" className={classes.selectImage} onClick={this._handleChangeImageMapClick} >
                {formatMessage(messages.editTourPanelChangeMapImage)}
            </Button>
            <FormControl fullWidth disabled={places.length === 0}>
                <InputLabel htmlFor="start-place-field">{formatMessage(messages.editTourPanelStartPlace)}</InputLabel>
                <Select
                    fullWidth
                    onChange={this._handleStartPlaceChanged}
                    input={<Input name="start-place-field" id="start-place-field" />}
                    value={startPlaceId}
                >
                    {places.map(place => <MenuItem key={place.id} value={place.id}>{place.name}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={tour.isPublic}
                        onChange={this._handleIsPublicChanged}
                        value="isPublic"
                    />
                }
                label={formatMessage(messages.editTourPanelIsPublic)}
                title={formatMessage(messages.editTourPanelIsPublicDescription)}
            />
            <TextField
                label={formatMessage(messages.editTourPanelDescription)}
                multiline
                rows={4}
                rowsMax={6}
                value={tour.description}
                onChange={this._handleChangeDescription}
                className={classes.description}
                variant="outlined"
                fullWidth
            />
            <PlaceList
                places={places}
                canClick={true}
                canDelete={true}
                onClick={this._handlePlaceClick}
                onViewClick={this._handleViewPlaceClick}
                onEditClick={this._handleEditPlaceClick}
                onDeleteClick={this._handleDeletePlaceClick}
            />
        </div>);
    }
}

export default withStyles(styles)(injectIntl(observer(EditTourPanel)));
