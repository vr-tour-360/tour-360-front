import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { PlayCircleFilledOutlined } from '@material-ui/icons'
import { getScreenCoordinates } from '../../utils';
import RunVideoShape from "./RunVideoShape";
import { RunVideoWidget as RunVideoWidgetModel } from "tour-360-backend/src/models/interfaces";

const size = 30;
const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        position: 'absolute',
        cursor: 'pointer',
        width: size,
        height: size,
    },
    isSelected: {
        backgroundColor: 'rgba(255,255,255, 0.3)',
        border: '1px dashed rgba(255,0,0, 0.3)',
    },
    icon: {
        width: size,
        height: size,
    }
});


interface RunVideoWidgetProps extends WithStyles<typeof styles> {
    isSelected: boolean;
    widget: RunVideoWidgetModel;
    onClick: (e: { origin: RunVideoWidget, widget: RunVideoWidgetModel }) => void;
}

class RunVideoWidget extends React.Component<RunVideoWidgetProps> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        isSelected: PropTypes.bool,
        widget: RunVideoShape,
        onClick: PropTypes.func.isRequired,
    }

    _handleClick(e) {
        e.stopPropagation();
        this.props.onClick({ origin: this, widget: this.props.widget })
    }

    render() {
        const { classes, isSelected, widget } = this.props;
        const { left, top } = getScreenCoordinates(widget.x, widget.y);

        const className = classNames({
            [classes.root]: true,
            [classes.isSelected]: isSelected,
        })

        return <div
            id={widget.id}
            className={className}
            title={widget.name}
            onClick={this._handleClick}
            style={{
                left,
                top,
            }}>
            <PlayCircleFilledOutlined className={classes.icon} />
        </div>;
    }
};

export default withStyles(styles)(observer(RunVideoWidget));