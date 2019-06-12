import React from 'react';
import { 
    AddLocation as AddPlaceIcon,
    LocationOff as RemovePlaceIcon,
    CallMade as AddConnection,
    PanTool as DragMapIcon
} from '@material-ui/icons';
import { ToolDesignerToolBarItemType } from './TourDesignerToolBar';

export function getIcon(mapEditMode: ToolDesignerToolBarItemType) {
    switch (mapEditMode) {
        case 'addPlace':
            return <AddPlaceIcon />
        case 'removePlace':
            return <RemovePlaceIcon />
        case 'addConnection':
            return <AddConnection />
        case 'dragMap':
            return <DragMapIcon />
        default:
            throw createError(mapEditMode)
    }
}

export const createError = (mapEditMode) => new Error(`Unknown map edit mode: ${mapEditMode}`);