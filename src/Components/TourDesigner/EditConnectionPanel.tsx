import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import PlacePosition from './PlacePosition';
import Slider from '@material-ui/lab/Slider';
import { intlShape, injectIntl } from 'react-intl';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        flex: 1,
        padding: theme.spacing.unit * 2,
        // slider causes overflow of panel
        overflow: 'hidden',
    },
});

interface EditConnectionPanelProps extends WithStyles<typeof styles> {
    intl: any;
    connection: any;
    onStartPlacePositionChanged: (e: { origin: EditConnectionPanel, value: number }) => void;
    onEndPlacePositionChanged: (e: { origin: EditConnectionPanel, value: number }) => void;
}

class EditConnectionPanel extends React.Component<EditConnectionPanelProps> {
    constructor(props) {
        super(props);

        this._handleStartPlacePositionChanged = this._handleStartPlacePositionChanged.bind(this);
        this._handleEndPlacePositionChanged = this._handleEndPlacePositionChanged.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        connection: PropTypes.shape({
            id: PropTypes.string.isRequired,
            startPlacePosition: PropTypes.number.isRequired,
            endPlacePosition: PropTypes.number.isRequired,
            startPlace: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            endPlace: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        onStartPlacePositionChanged: PropTypes.func.isRequired,
        onEndPlacePositionChanged: PropTypes.func.isRequired,

        intl: intlShape.isRequired,
    };

    _handleStartPlacePositionChanged(e, value) {
        this.props.onStartPlacePositionChanged({
            origin: this,
            value,
        })
    }

    _handleEndPlacePositionChanged(e, value) {
        this.props.onEndPlacePositionChanged({
            origin: this,
            value,
        });
    }

    _renderPlacePosition(options) {
        const { classes } = this.props;
        const { id, label, value, onChange } = options;

        return <>
            <Typography id={id}>{label}</Typography>
            <Slider
                classes={{ container: classes.slider, thumb: classes.thumb }}
                value={value}
                aria-labelledby={id}
                min={0}
                max={359}
                step={1}
                onChange={onChange}
            />
            <Typography variant="caption" align="right">{value}</Typography>
        </>;
    }

    render() {
        const { classes, connection } = this.props;
        const { messages, formatMessage } = this.props.intl;

        return <div className={classes.root}>
            <PlacePosition
                id="start-place-position"
                label={`${connection.startPlace.name} - ${formatMessage(messages.editConnectionPanelStartPlacePosition)}`}
                value={connection.startPlacePosition}
                onChange={this._handleStartPlacePositionChanged} />
            <PlacePosition
                id="end-place-position"
                label={`${connection.endPlace.name} - ${formatMessage(messages.editConnectionPanelEndPlacePosition)}`}
                value={connection.endPlacePosition}
                onChange={this._handleEndPlacePositionChanged} />
        </div>;
    }
}

export default withStyles(styles)(injectIntl(observer(EditConnectionPanel)));
