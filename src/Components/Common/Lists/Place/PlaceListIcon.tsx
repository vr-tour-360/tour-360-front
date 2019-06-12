import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Theme, WithStyles, StyleRulesCallback, withStyles } from '@material-ui/core';

const styles = (theme: Theme) => ({
    iconHolder: {
        width: 48,
        height: 48,
    },
    icon: {
        maxWidth: 40,
        maxHeight: 40,
        padding: 4,
    },
});

interface PlaceListIcon extends WithStyles<typeof styles> {
    styles?: { root?: CSSProperties },
    iconUrl?: string;
    classNames?: {
        root?: string,
        icon?: string,
    }
}

function PlaceListIcon(props: PlaceListIcon) {
    const iconUrl = props.iconUrl || '/src/markers/default.svg';
    
    return <div className={classnames({
        [props.classes.iconHolder]: true,
        [props.classNames && props.classNames.root]: Boolean(props.classNames && props.classNames.root),
    })} style={props.styles && props.styles.root}>
        <img className={classnames({
            [props.classes.icon]: true,
            [props.classNames && props.classNames.icon]: Boolean(props.classNames && props.classNames.icon),
        })} src={iconUrl} />
    </div>;
}

export default withStyles(styles)(PlaceListIcon);