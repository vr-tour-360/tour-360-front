import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import { Image as ImageIcon } from '@material-ui/icons'
import { getScreenCoordinates } from '../../utils';
import ImageWidgetShape from "./ImageWidgetShape";
import { ImageWidget as ImageWidgetModel } from "../../../../../../backend/src/models/interfaces";
import { BACKEND_URL } from '../../../../config';

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
    },
    img: {
        width: '100%',
        height: '100%',
    }
});


interface ImageWidgetProps extends WithStyles<typeof styles> {
    isSelected: boolean;
    widget: ImageWidgetModel;
    onClick: (e: { origin: ImageWidget, widget: ImageWidgetModel }) => void;
}

class ImageWidget extends React.Component<ImageWidgetProps> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        isSelected: PropTypes.bool,
        widget: ImageWidgetShape,
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
        });

        return <div
            id={widget.id}
            className={className}
            title={widget.name}
            onClick={this._handleClick}
            style={{
                left,
                top,
                width: widget.image ? widget.width : size,
                height: widget.image ? widget.height : size,
            }}>
            {widget.image ? <img 
                src={`${BACKEND_URL}${widget.image.filename}`} 
                alt="image"
                className={classes.img}
            /> : <ImageIcon />}
        </div>;
    }
};

export default withStyles(styles)(observer(ImageWidget));