import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { IconButton, Tooltip } from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import {
    ThreeSixty as ThreeSixtyIcon,
    Code as CodeIcon,
} from '@material-ui/icons';
import { TourMap } from "../Components/TourDesigner";
import { InfoPanel } from "../Components";
import { requireAuth } from '../HOC';
import { RootStore, UserStore } from '../Stores';
import { PlaceService } from '../api';

const styles = (theme: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
    },
    infoPanel: {
        position: 'absolute' as 'absolute',
        top: 10,
        right: 10,
        width: '20vw',
        maxHeight: '90%',
        zIndex: 999999999,
    },
});

interface ViewMapPageProps extends WithStyles<typeof styles> {
    //TODO: to fix heroku build
    match: any;
    intl: any;
    rootStore: RootStore;
}

function getCurrentUrl(): string {
    const url = window.location.href;
    const arr = url.split("/");
    const result = arr[0] + "//" + arr[2]

    return result;
}

class ViewMapPage extends React.Component<ViewMapPageProps> {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    get store() {
        return this.props.rootStore.viewTourStore;
    }
    get tour() {
        return this.store.tour;
    }
    get selectedPlace() {
        return this.store.selectedPlace;
    }

    componentDidMount() {
        if (!this.tour) {
            const { tourId } = this.props.match.params;
            this.store.selectById(tourId);
        }
    }

    render() {
        if (!this.tour) {
            return null;
        }

        const { classes } = this.props;
        const { formatMessage, messages } = this.props.intl;

        return <div className={classes.root}>
            <TourMap
                tour={this.tour}
                draggableMarkers={false}
                onClick={() => {
                    this.store.clearSelectedPlace();
                }}
                onPlaceClick={(e) => {
                    this.store.selectPlaceById(e.place.id);
                }}
                onConnectionClick={() => {
                    this.store.clearSelectedPlace();
                }}
            />
            {!this.selectedPlace && <InfoPanel
                classNames={{ root: classes.infoPanel }}
                imageUrl={this.tour.imageUrl}
                title={this.tour.name}
                description={this.tour.description}
                titleChildren={
                    <Tooltip title={formatMessage(messages.copyPlaceCode)}>
                        <IconButton onClick={() => navigator.clipboard.writeText(`<iframe src="${getCurrentUrl()}/tour/${this.tour.id}/view-tour"></iframe>`)}>
                            <CodeIcon />
                        </IconButton>
                    </Tooltip>
                }
            />}
            {this.selectedPlace && <InfoPanel
                classNames={{ root: classes.infoPanel }}
                imageUrl={this.selectedPlace.coverUrl}
                title={this.selectedPlace.name}
                description={this.selectedPlace.description}
                titleChildren={
                    <div>
                        <Tooltip title={formatMessage(messages.copyTourCode)}>
                            <IconButton onClick={() => navigator.clipboard.writeText(`<iframe src="${PlaceService.getPanoUrl(this.tour.id, this.selectedPlace.id, UserStore.getToken())}"></iframe>`)}>
                                <CodeIcon />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={() => this.tour.viewPlacePano(this.selectedPlace.id)}>
                            <ThreeSixtyIcon />
                        </IconButton>
                    </div>
                }
            />}
        </div>;
    }
}

export default injectIntl(withStyles(styles)(requireAuth(inject("rootStore")(observer(ViewMapPage)))));
