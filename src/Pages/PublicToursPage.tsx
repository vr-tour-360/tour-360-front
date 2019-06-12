import React from 'react';
import { Typography } from '@material-ui/core'
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { observer, inject } from 'mobx-react';
import { PageWrapper } from './../Components/Common';
import { Tours } from './../Components';
import {
    Visibility as VisibilityIcon,
    Map as MapIcon,
} from '@material-ui/icons';
import { PublicToursStore, RootStore, Tour } from './../Stores';
import { grey } from "@material-ui/core/colors";

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        display: 'flex',
        flex: 1,
    },
    noTours: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: grey[700],
        fontSize: '24px',
    },
    toursWrapper: {
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '12px',
        flexGrow: 1,
    }
});


interface PublicToursPageProps extends WithStyles<typeof styles> {
    rootStore: RootStore;
    intl: any;
}

interface PublicToursPageState { }

class PublicToursPage extends React.Component<PublicToursPageProps, PublicToursPageState> {
    componentDidMount() {
        this.tourStore.loadTours();
    }

    get tourStore(): PublicToursStore {
        return this.props.rootStore.publicToursStore;
    }

    _handleTourItemClick = (e: { tour: Tour }) => {
        this.tourStore.selectTour(e.tour.id);
    }

    _getActions = (e: { tour: Tour }) => {
        const { messages, formatMessage } = this.props.intl;

        const actions = [{
            icon: <MapIcon />,
            text: formatMessage(messages.toursPageTourMap),
            action: (e) => {
                this.tourStore.viewMap(e.tour.id);
            }
        }];

        if (e.tour.startPlaceId) {
            actions.push({
                icon: <VisibilityIcon />,
                text: formatMessage(messages.view),
                action: (e) => {
                    this.tourStore.viewPlacePano(e.tour.id);
                }
            });
        }

        return actions;
    }

    render() {
        const { formatMessage, messages } = this.props.intl;
        const { selectedTour, tours, hasTours } = this.tourStore;
        const { classes } = this.props;

        return <PageWrapper
            title={formatMessage(messages.publicTours)}
        >
            <div className={classes.toursWrapper}>
                <div className={classes.root}>
                    {hasTours && <Tours
                        selectedTourId={selectedTour && selectedTour.id}
                        tours={tours}
                        onItemClick={this._handleTourItemClick}
                        getActions={this._getActions}
                    />}
                    {!hasTours && <Typography className={classes.noTours}>{formatMessage(messages.publicToursPageNoToursLabel)}</Typography>}
                </div>
            </div>
        </PageWrapper >;
    }
}

export default withStyles(styles)(
    injectIntl(
        inject("rootStore")(observer(PublicToursPage))
    )
);