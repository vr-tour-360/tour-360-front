import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import {
    List,
    ListSubheader,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import { WidgetItem } from '../..';
import {
    BaseWidget,
    TextWidget as ITextWidget,
    RunVideoWidget as IRunVideoWidget,
    HintWidget as IHintWidget,
    ImageWidget as IImageWidget
} from 'tour-360-backend/src/models/interfaces';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${grey[300]}`,
    }
});

interface WidgetListProps {
    intl: any;
    classes: any;
    widgets: BaseWidget[];
    className: string;
    onClick: (e: { origin: any, widget: BaseWidget }) => void;
    onRemoveClick: (e: { origin: any, widget: BaseWidget }) => void;
}

class WidgetList extends React.Component<WidgetListProps> {
    static propTypes = {
        widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
        onClick: PropTypes.func.isRequired,
        onRemoveClick: PropTypes.func.isRequired,
    
        classes: PropTypes.object.isRequired,
        className: PropTypes.string.isRequired,
        intl: intlShape.isRequired,
    };

    _getTitle(widget: BaseWidget) {
        switch (widget.type) {
            case 'text':
                return (widget as ITextWidget).content
            case 'run-video':
                return (widget as IRunVideoWidget).name
            case 'hint':
                return (widget as IHintWidget).content
            case 'image':
                return (widget as IImageWidget).name
            default:
                throw new Error('Unknown widget type')
        }
    }

    render() {
        const { widgets, classes, className, onClick, onRemoveClick } = this.props;
        const { messages, formatMessage } = this.props.intl;
        const hasWidgets = widgets && widgets.length > 0;

        const root = classnames({
            [classes.root]: true,
            [className]: !!className,
        });

        return <List className={root} subheader={<ListSubheader>{formatMessage(messages.widgets)}</ListSubheader>}>
            {hasWidgets && (widgets || []).map(widget =>
                <WidgetItem
                    key={widget.id}
                    title={this._getTitle(widget)}
                    widget={widget}
                    onClick={onClick}
                    onRemoveClick={onRemoveClick}
                />
            )}
            {!hasWidgets && <Typography align="center" variant="caption" color="textPrimary">{formatMessage(messages.noWidgets)}</Typography>}
        </List>;
    }
}

export default withStyles(styles)(injectIntl(WidgetList));
