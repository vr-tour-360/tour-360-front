import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import classNames from 'classnames';
import { intlShape, injectIntl } from 'react-intl';

const styles = theme => ({
    root: {
        background: 'white',
        position: 'relative',
        border: `1px solid ${grey[300]}`,
        '&:hover': {
            '& $titleBar': {
                opacity: 1,
            },
        },
    },
    titleBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        background:
            `linear-gradient(to top, rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)`,
        opacity: 0,
        transition: 'all 200ms ease-in',
        height: theme.spacing.unit * 6,
        position: 'absolute',
        bottom: 0,
        cursor: 'pointer',
    },
    changeImageLabel: {
        color: 'white',
    },
    changeImageIcon: {
        color: 'white',
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    cover: {
        display: 'flex',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '100%',
    },
});

class EditImage extends React.Component {
    constructor(props) {
        super(props);

        this._handleImageChangeClick = this._handleImageChangeClick.bind(this);
    }

    _handleImageChangeClick() {
        this.props.onImageChangeClick({ origin: this });
    }

    render() {
        const { name, imageUrl, classes, className } = this.props;
        const root = classNames({
            [className]: !!className,
            [classes.root]: true,
        });
        const { messages, formatMessage } = this.props.intl;

        return (
            <div className={root}>
                <img className={classes.cover} src={imageUrl || `/src/no-image.png`} alt={name || ''} />
                <div className={classes.titleBar} onClick={this._handleImageChangeClick}>
                    <Typography variant="subtitle1" align='center' inline={true} noWrap={true} className={classes.changeImageLabel}>{formatMessage(messages.editImageChangeImage)}</Typography>
                    <CloudUpload className={classes.changeImageIcon} />
                </div>
            </div>
        );
    }
}

EditImage.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onImageChangeClick: PropTypes.func.isRequired,
    
    intl: intlShape.isRequired,
};

export default withStyles(styles)(injectIntl(EditImage));
