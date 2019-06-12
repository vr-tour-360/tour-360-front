import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    List,
    Button,
    ListSubheader,
    ListItem,
    IconButton,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons'
import { AudioPlayer } from '@blackbox-vision/mui-audio-player';
import grey from '@material-ui/core/colors/grey';
import classnames from 'classnames';
import { intlShape, injectIntl } from 'react-intl';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
        border: `1px solid ${grey[300]}`,
    },
});

class SoundEditor extends React.Component {
    constructor(props) {
        super(props);

        this._handleSoundChanged = this._handleSoundChanged.bind(this);
        this._handleSoundRemoved = this._handleSoundRemoved.bind(this);
    }

    _handleSoundChanged(e) {
        const file = e.target.files[0];

        if (file) {
            this.props.onSoundChanged({
                file,
                origin: this,
            });
        }
    }

    _handleSoundRemoved(e) {
        this.props.onSoundRemoved({ origin: this });
    }

    render() {
        const { soundUrl, classes, classNames = {} } = this.props;
        const { messages, formatMessage } = this.props.intl;

        if (!soundUrl) {
            return <Button className={classNames.changeSound} variant="text" component="label" color="primary" fullWidth>
                {formatMessage(messages.soundEditorChangeSound)}
                <input type="file" style={{ display: "none" }} onChange={this._handleSoundChanged} />
            </Button>;
        }

        const editorClass = classNames.editor || '';

        const root = classnames({
            [editorClass]: !!editorClass,
            [classes.root]: true,
        })

        return <List
            component="nav"
            subheader={<ListSubheader component="div">{formatMessage(messages.soundEditorToursSound)}</ListSubheader>}
            className={root}
        >
            <ListItem>
                {/*key used to force updating when src https://github.com/facebook/react/issues/9447 */}
                <AudioPlayer key={soundUrl}
                    src={soundUrl}
                    autoPlay={false}
                    rounded={null}
                    elevation={0}
                    showLoopIcon={false}
                    width="100%"
                />
                <IconButton onClick={this._handleSoundRemoved}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        </List>
    }
}

SoundEditor.propTypes = {
    soundUrl: PropTypes.string,
    classNames: PropTypes.shape({
        editor: PropTypes.string,
        changeSound: PropTypes.string,
    }),

    onSoundChanged: PropTypes.func.isRequired,
    onSoundRemoved: PropTypes.func.isRequired,

    intl: intlShape.isRequired,
};

export default withStyles(styles)(injectIntl(SoundEditor));