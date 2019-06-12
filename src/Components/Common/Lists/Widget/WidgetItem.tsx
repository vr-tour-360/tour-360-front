import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import {
    ListItem,
    ListItemText,
    IconButton,
    ListItemIcon,
} from '@material-ui/core';
import {
    Delete as DeleteIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { BaseWidget } from 'tour-360-backend/src/models/interfaces';
import { getIcon } from '../../../PlaceDesigner/Widgets/utils';

const styles = theme => ({
    root: {
    }
});

interface WidgetItemProps {
    title: string;
    widget: BaseWidget;
    onClick: (e: { origin: WidgetItem, widget: BaseWidget }) => void;
    onRemoveClick: (e: { origin: WidgetItem, widget: BaseWidget }) => void;
}

class WidgetItem extends React.Component<WidgetItemProps> {
    constructor(props: WidgetItemProps) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
        this._handleRemoveClick = this._handleRemoveClick.bind(this);
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        widget: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        onRemoveClick: PropTypes.func.isRequired,

        classes: PropTypes.object.isRequired,
        intl: intlShape.isRequired,
    };

    _handleClick() {
        this.props.onClick && this.props.onClick({ origin: this, widget: this.props.widget });
    }

    _handleRemoveClick(e) {
        e.stopPropagation();
        this.props.onRemoveClick && this.props.onRemoveClick({ origin: this, widget: this.props.widget });
    }

    render() {
        const { title, widget } = this.props;

        return (
            <ListItem
                button
                onClick={this._handleClick}>
                <ListItemIcon>
                    {getIcon(widget.type)}
                </ListItemIcon>
                <ListItemText primary={title} />
                <IconButton onClick={this._handleRemoveClick}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        );
    }
}

export default withStyles(styles)(injectIntl(WidgetItem));
