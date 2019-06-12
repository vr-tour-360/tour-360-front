import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import { observer } from 'mobx-react';
import {
    EditImage,
    PlaceList,
} from './';
import { TourDetail } from './../Stores';

const styles = createStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        backgroundColor: grey[100],
        borderLeft: `1px solid ${grey[300]}`,
        padding: theme.spacing.unit * 2,
    },
    editImage: {
        width: '80%',
    },
    places: {
        marginTop: 20,
    }
}));

interface ViewTourProps extends WithStyles<typeof styles> {
    tour: TourDetail;
    width: string;
    onImageChangeClick: ({ origin: ViewTourPanel, tour: TourDetail }) => void;
    onViewPlaceClick: ({ origin: ViewTourPanel, tour: TourDetail, place, }) => void;
    onEditPlaceClick: ({ origin: ViewTourPanel, tour: TourDetail, place, }) => void;
}

class ViewTourPanel extends React.Component<ViewTourProps> {
    constructor(props) {
        super(props);

        this._handleImageChangeClick = this._handleImageChangeClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        tour: PropTypes.shape({
            name: PropTypes.string.isRequired,
            places: PropTypes.arrayOf(PropTypes.object),
        }).isRequired,
        width: PropTypes.string,
        onImageChangeClick: PropTypes.func.isRequired,
        onViewPlaceClick: PropTypes.func.isRequired,
        onEditPlaceClick: PropTypes.func.isRequired,
    }

    _handleImageChangeClick() {
        this.props.onImageChangeClick({ origin: this, tour: this.props.tour });
    }

    render() {
        const classes: any = this.props.classes;
        const { width, tour } = this.props;

        return (
            <div className={classes.root} style={{ width: width || '250px' }}>
                <Typography variant="h4" gutterBottom align='center'>{tour.name}</Typography>

                <EditImage
                    className={classes.editImage}
                    hasImage={true}
                    name={tour.name}
                    imageUrl={tour.imageUrl}
                    onImageChangeClick={this._handleImageChangeClick}
                />

                <PlaceList
                    className={classes.places}
                    places={tour.places}
                    canClick={false}
                    canDelete={false}
                    onViewClick={(e) => this.props.onViewPlaceClick({
                        origin: this,
                        place: e.place,
                        tour,
                    })}
                    onEditClick={(e) => this.props.onEditPlaceClick({
                        origin: this,
                        place: e.place,
                        tour,
                    })}
                />
            </div>
        );
    }
}

export default withStyles(styles)(observer(ViewTourPanel));