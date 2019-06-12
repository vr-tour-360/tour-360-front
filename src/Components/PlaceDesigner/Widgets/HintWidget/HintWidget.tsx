import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { getScreenCoordinates } from '../../utils';
import HintWidgetShape from "./HintWidgetShape";
import { HintWidget as HintWidgetModel } from "../../../../../../backend/src/models/interfaces";

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        width: 32,
        height: 32,
        position: 'absolute',
    },
    isSelected: {
        backgroundColor: 'rgba(255,255,255, 0.3)',
        border: '1px dashed rgba(255,0,0, 0.3)',
    },
});

interface HintWidgetProps extends WithStyles<typeof styles> {
    isSelected: boolean;
    widget: HintWidgetModel;
    onClick: (e: { origin: HintWidget, widget: HintWidgetModel }) => void;
}

class HintWidget extends React.Component<HintWidgetProps> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        isSelected: PropTypes.bool,
        widget: HintWidgetShape,
        onClick: PropTypes.func.isRequired,
    }

    _handleClick(e) {
        e.stopPropagation();
        this.props.onClick({ origin: this, widget: this.props.widget })
    }

    render() {
        const { classes, widget, isSelected } = this.props;
        const { left, top } = getScreenCoordinates(widget.x, widget.y);
        const className = classnames({
            [classes.root]: true,
            [classes.isSelected]: isSelected,
        })

        return (
            <img
                id={widget.id}
                style={{
                    left,
                    top,
                }}
                src={require('../../../../imgs/info.png')}
                className={className}
                onClick={this._handleClick}
            />
        );
    }
}

export default withStyles(styles)(observer(HintWidget));