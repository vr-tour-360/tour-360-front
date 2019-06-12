import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { getScreenCoordinates } from '../../utils';
import TextWidgetShape from "./TextWidgetShape";
import { TextWidget as TextWidgetModel } from "../../../../../../backend/src/models/interfaces";

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        position: 'absolute',
        cursor: 'pointer',
    },
    isSelected: {
        backgroundColor: 'rgba(255,255,255, 0.3)',
        border: '1px dashed rgba(255,0,0, 0.3)',
    },
});

interface TextWidgetProps extends WithStyles<typeof styles> {
    isSelected: boolean;
    widget: TextWidgetModel;
    onClick: ({ origin: TextWidget, widget: TextWidgetModel }) => void;
}

class TextWidget extends React.Component<TextWidgetProps> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        isSelected: PropTypes.bool,
        widget: TextWidgetShape,
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

        return <span
            id={widget.id}
            className={className}
            onClick={this._handleClick}
            style={{
                left,
                top,
                color: widget.color,
                backgroundColor: widget.backgroundColor,
                padding: widget.padding,
            }}>{widget.content || '[No Content]'}</span>;
    }
};

export default withStyles(styles)(observer(TextWidget));