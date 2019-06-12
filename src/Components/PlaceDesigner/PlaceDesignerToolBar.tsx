import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Theme, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { WidgetType } from '../../../../backend/src/models/interfaces';
import { getIcon, createError } from './Widgets/utils';
import {
    PanTool as PanToolIcon
} from '@material-ui/icons';
import { intlShape, injectIntl } from 'react-intl';
import ToolBar, { ToolbarItem } from '../Common/Toolbar';

const styles: StyleRulesCallback = (theme: Theme) => ({
});

export type PlaceDesignerToolBarItemType = WidgetType | 'selection';
const types: PlaceDesignerToolBarItemType[] = ['selection', 'text', 'run-video', 'hint', 'image']
export const WidgetTypeShape = PropTypes.oneOf(types);

export interface PlaceDesignerToolBarProps extends WithStyles<typeof styles> {
    intl: any;
    selectedWidget: PlaceDesignerToolBarItemType;
    onWidgetClick: (e: { origin: PlaceDesignerToolBar, type: PlaceDesignerToolBarItemType }) => void;
}

class PlaceDesignerToolBar extends React.Component<PlaceDesignerToolBarProps> {
    static propTypes = {
        intl: intlShape,
        selectedWidget: WidgetTypeShape,
        onWidgetClick: PropTypes.func.isRequired,
    };

    getDescription(widgetType: PlaceDesignerToolBarItemType) {
        const { messages, formatMessage } = this.props.intl;

        switch (widgetType) {
            case 'selection':
                return formatMessage(messages.widgetBarSelectionMode);
            case 'text':
                return formatMessage(messages.widgetBarText);
            case 'run-video':
                return formatMessage(messages.widgetBarRunVideo);
            case 'hint':
                return formatMessage(messages.widgetBarHint);
            case 'image':
                return formatMessage(messages.widgetBarImage)
            default:
                throw createError(widgetType);
        }

    }

    getIcon(PlaceDesignerToolBarItemType: PlaceDesignerToolBarItemType) {
        if (PlaceDesignerToolBarItemType === 'selection') {
            return <PanToolIcon />;
        } else {
            return getIcon(PlaceDesignerToolBarItemType);
        }
    }

    render() {
        const { selectedWidget } = this.props;

        const widgets = types.map(item => ({
            id: item,
            icon: this.getIcon(item),
            isSelected: item === selectedWidget,
            title: this.getDescription(item),
        }) as ToolbarItem);

        return <ToolBar
            items={widgets}
            onItemClick={(e) => this.props.onWidgetClick({ origin: this, type: e.item.id as PlaceDesignerToolBarItemType })}
        />;
    }
}

export default withStyles(styles)(injectIntl(PlaceDesignerToolBar));