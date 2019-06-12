import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Theme, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { getIcon, createError } from './utils';
import { injectIntl } from 'react-intl';

import ToolBar, { ToolbarItem } from '../Common/Toolbar';

const styles: StyleRulesCallback = (theme: Theme) => ({
});

export interface MapEditModeBarItem {
    mode: ToolDesignerToolBarItemType;
}

export type ToolDesignerToolBarItemType = 'addPlace' | 'removePlace' | 'addConnection' | 'dragMap';

interface TourDesignerToolBarProps extends WithStyles<typeof styles> {
    intl: any;
    selectedMode: ToolDesignerToolBarItemType;
    onModeChanged: (e: { origin: TourDesignerToolBar, mode: ToolDesignerToolBarItemType }) => void;
}

const modes: ToolDesignerToolBarItemType[] = ['dragMap', 'addPlace', 'removePlace', 'addConnection'];

class TourDesignerToolBar extends React.Component<TourDesignerToolBarProps> {
    static propTypes = {
        selectedMode: PropTypes.oneOf(modes).isRequired,
    };

    getDescription(mode: ToolDesignerToolBarItemType) {
        const { messages, formatMessage } = this.props.intl;

        switch (mode) {
            case 'addPlace':
                return formatMessage(messages.mapEditModeBarAddPlace)
            case 'removePlace':
                return formatMessage(messages.mapEditModeBarRemovePlace)
            case 'addConnection':
                return formatMessage(messages.mapEditModeBarAddConnection)
            case 'dragMap':
                return formatMessage(messages.mapEditModeBarDragMap)
            default:
                throw createError(mode)
        }
    }

    render() {
        const items = modes.map(item => ({
            id: item,
            title: this.getDescription(item),
            icon: getIcon(item),
            isSelected: item === this.props.selectedMode,
        } as ToolbarItem));

        return <ToolBar
            items={items}
            onItemClick={(e) => this.props.onModeChanged({ origin: this, mode: e.item.id as ToolDesignerToolBarItemType })}
        />;
    }
}

export default withStyles(styles)(injectIntl(TourDesignerToolBar));