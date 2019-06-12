import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { intlShape, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import {
    GridListTile,
    GridListTileBar,
    IconButton,
    MenuList,
    MenuItem,
    Popover,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@material-ui/core';
import {
    Public as PublicIcon,
    MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import { TourCover } from '.';
import { Tour, UserStore } from './../Stores';

const styles: StyleRulesCallback = (theme: Theme) => ({
    moreIcon: {
        color: 'white',
    },
    cover: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
    noCover: {
        padding: theme.spacing.unit * 6,
    },
    tileItem: {
        cursor: 'pointer',
        width: '300px',
        height: '300px',
        backgroundColor: 'white',
        border: `1px solid ${grey[300]}`,
        listStyle: 'none',
        '&:hover': {
            borderColor: theme.palette.primary.light,
            '& $tileItemBar': {
                backgroundColor: theme.palette.primary.light,
            }
        }
    },
    tileItemBar: {
        borderColor: theme.palette.primary.light,
    },
    selectedTileItem: {
        borderColor: theme.palette.secondary.light,
        '& $tileItemBar': {
            backgroundColor: theme.palette.secondary.light,
        }
    },
    isPublic: {
        position: 'absolute',
        top: 5,
        right: 5,
        color: theme.palette.primary.light,
    }
});

export interface TourItemAction {
    text: string;
    icon: React.ReactElement;
    action: (event: { origin: TourItem, tour: Tour }) => void;
}

export interface TourItemProps extends WithStyles<typeof styles> {
    intl: { messages, formatMessage };
    tour: Tour;
    isSelected: boolean;
    onItemClick: (event: { origin: TourItem, tour: Tour }) => void;
    getActions: (event: { origin: TourItem, tour: Tour }) => TourItemAction[];
}

class TourItem extends React.Component<TourItemProps> {
    constructor(props) {
        super(props);

        this._handleItemClick = this._handleItemClick.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._handleActionClick = this._handleActionClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        isSelected: PropTypes.bool,
        tour: PropTypes.shape({
            id: PropTypes.string,
            img: PropTypes.string,
            name: PropTypes.string,
        }),
        onItemClick: PropTypes.func,
        getActions: PropTypes.func.isRequired,
    };

    state = {
        anchorEl: null,
    };

    _handleClick(event) {
        event.stopPropagation();
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    _handleClose() {
        this.setState({
            anchorEl: null,
        });
    };

    _handleItemClick(e) {
        this.props.onItemClick && this.props.onItemClick({ origin: this, tour: this.props.tour });
    }

    _handleActionClick(action: TourItemAction) {
        action.action({
            origin: this,
            tour: this.props.tour,
        });
        this._handleClose();
    }

    render() {
        const { tour, getActions, isSelected, classes } = this.props;
        const { messages, formatMessage } = this.props.intl;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        const root = classname({
            [classes.tileItem]: true,
            [classes.selectedTileItem]: isSelected,
        });

        const isYourTour = UserStore.getCurrentUser() && UserStore.getCurrentUser().id === tour.authorId;// tour tour.authorFullName

        return (<>
            <GridListTile
                key={tour.id}
                className={root}
                onClick={this._handleItemClick}>
                <>
                    {tour.isPublic && <Tooltip title={formatMessage(messages.tourItemTooltip)}>
                        <PublicIcon className={classes.isPublic} />
                    </Tooltip>}
                    <TourCover hasImage={tour.hasImage} name={tour.name} imageUrl={tour.imageUrl} />
                </>
                <GridListTileBar
                    className={classes.tileItemBar}
                    title={tour.name}
                    subtitle={isYourTour ? formatMessage(messages.yourTour) : tour.authorFullName}
                    actionIcon={
                        <IconButton className={classes.moreIcon}
                            aria-owns={open ? 'simple-popper' : undefined}
                            aria-haspopup="true"
                            onClick={this._handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                    }
                />
            </GridListTile>
            <Popover
                id="simple-popper"
                open={open}
                anchorEl={anchorEl}
                onClose={this._handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <MenuList>
                    {getActions({
                        origin: this,
                        tour,
                    }).map(action => (
                        <MenuItem key={action.text} className={classes.menuItem} onClick={() => this._handleActionClick(action)}>
                            <ListItemIcon>
                                {action.icon}
                            </ListItemIcon>
                            <ListItemText primary={action.text} />
                        </MenuItem>
                    ))}
                </MenuList>
            </Popover>
        </>);
    }
}

export default injectIntl(withStyles(styles)(observer(TourItem)));
