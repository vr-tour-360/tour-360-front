import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import {
    Clear as ClearIcon,
    Edit as EditIcon,
    CloudUpload as UploadIcon,
} from "@material-ui/icons"
import {
    List,
    ListItem,
    IconButton,
    ListItemText,
    Typography,
    ListSubheader,
} from "@material-ui/core";
import { intlShape, injectIntl } from 'react-intl';
import grey from '@material-ui/core/colors/grey';
import classnames from 'classnames';
import PlaceListIcon from './../Common/Lists/Place/PlaceListIcon';

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${grey[300]}`,
    },
    size: {
        color: grey[700],
        lineHeight: 1,
    },
    noImageText: {
        textAlign: 'center',
    },
    imageName: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
});

interface IconEditorProps extends WithStyles<typeof styles> {
    intl: { formatMessage: any, messages: any };
    image: {
        url: string;
        filename: string;
        width: number;
        height: number;
    },
    className: string;
    onUploadClick: (e: { origin: IconEditor, }) => void;
    onClearClick: (e: { origin: IconEditor, }) => void;
    onEditClick: (e: { origin: IconEditor, }) => void;
}

class IconEditor extends React.Component<IconEditorProps> {
    constructor(props: IconEditorProps) {
        super(props);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        intl: intlShape,
        className: PropTypes.string,
        image: PropTypes.shape({
            url: PropTypes.string.isRequired,
            filename: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        }),
        onUploadClick: PropTypes.func.isRequired,
        onEditClick: PropTypes.func.isRequired,
        onClearClick: PropTypes.func.isRequired,
    }

    render() {
        const {
            image,
            classes,
            className,
            onEditClick,
            onClearClick,
            onUploadClick,
        } = this.props;
        const { messages, formatMessage } = this.props.intl;

        const root = classnames({
            [classes.root]: true,
            [className]: !!className,
        });

        const iconUrl = image ? image.url : '/src/markers/default.svg';

        return (<List
            className={root}
            subheader={<ListSubheader>{formatMessage(messages.mapIcon)}</ListSubheader>}
        >
            <ListItem>
                <PlaceListIcon iconUrl={iconUrl} />
                {image && <ListItemText
                    classes={{ primary: classes.imageName }}
                    primary={image.filename}
                    secondary={
                        <React.Fragment>
                            <Typography component="span" variant="caption" className={classes.size}>
                                {formatMessage(messages.width)}: {image.width}
                            </Typography>
                            <Typography component="span" variant="caption" className={classes.size}>
                                {formatMessage(messages.height)}: {image.height}
                            </Typography>
                        </React.Fragment>
                    } />}
                {image && <IconButton onClick={(e) => onEditClick({ origin: this, })}>
                    <EditIcon />
                </IconButton>}
                {image && <IconButton onClick={(e) => onClearClick({ origin: this, })}>
                    <ClearIcon />
                </IconButton>}
                {!image && <ListItemText classes={{ root: classes.noImageText }} primary={formatMessage(messages.iconNotSelected)} />}
                {!image && <IconButton onClick={(e) => onUploadClick({ origin: this, })}>
                    <UploadIcon />
                </IconButton>}
            </ListItem>
        </List>);
    }
}

export default withStyles(styles)(injectIntl(IconEditor));