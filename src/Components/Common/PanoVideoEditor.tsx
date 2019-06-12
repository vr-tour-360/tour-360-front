import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, ListItem, ListSubheader, IconButton } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { intlShape, injectIntl } from 'react-intl';
import classnames from 'classnames';

const styles = createStyles(theme => {

});

interface PanoVideoEditorProps extends WithStyles<typeof styles> {
    intl: any;
    classes: any;

    filename: string;
    videoUrl: string;
    classNames: {
        editor: string,
        changeSound: string,
    };
    onPanoVideoChanged: ({ origin: PanoVideoEditor, file: File }) => void;
    onPanoVideoRemoved: ({ origin: PanoVideoEditor }) => void;
}

class PanoVideoEditor extends React.Component<PanoVideoEditorProps> {
    constructor(props) {
        super(props);

        this._handlePanoVideoChanged = this._handlePanoVideoChanged.bind(this);
        this._handleSoundRemoved = this._handleSoundRemoved.bind(this);
    }

    static propTypes = {
        filename: PropTypes.string,
        videoUrl: PropTypes.string,
        classNames: PropTypes.shape({
            editor: PropTypes.string,
            changeSound: PropTypes.string,
        }),

        onPanoVideoChanged: PropTypes.func.isRequired,
        onPanoVideoRemoved: PropTypes.func.isRequired,

        intl: intlShape.isRequired,
    };

    _handlePanoVideoChanged(e) {
        const file = e.target.files[0];

        if (file) {
            this.props.onPanoVideoChanged({
                file,
                origin: this,
            });
        }
    }

    _handleSoundRemoved() {
        this.props.onPanoVideoRemoved({ origin: this });
    }

    render() {
        const { videoUrl, classes, filename, classNames = {
            editor: '',
            changeSound: '',
        } } = this.props;
        const { messages, formatMessage } = this.props.intl;

        if (!videoUrl) {
            return <Button 
                        className={classNames.changeSound} 
                        variant="text" 
                        component="label" 
                        color="primary" 
                        fullWidth
                    >
                        {formatMessage(messages.panoVideoEditorChangeVideo)}
                        <input type="file" style={{ display: "none" }} onChange={this._handlePanoVideoChanged} />
                    </Button>
        }

        const editorClass = classNames.editor || '';

        const root = classnames({
            [editorClass]: !!editorClass,
            [classes.root]: true,
        })

        return <List
            component="nav"
            subheader={<ListSubheader component="div">{formatMessage(messages.panoVideoEditorPlaceVideo)}</ListSubheader>}
            className={root}
        >
            <ListItem>
                <div>{filename}</div>
                <IconButton onClick={this._handleSoundRemoved}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        </List>
    }
}

export default withStyles(styles)(injectIntl(PanoVideoEditor));
