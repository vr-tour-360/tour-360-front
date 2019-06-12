import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import equirectToCubemapFaces from 'equirect-cubemap-faces-js';
import { CircularProgress } from '@material-ui/core';
import { getX, getY } from './utils';
const CUBE_SIZE = 1170;

const styles = (theme: Theme) => ({
    root: {
    },
    rootLoading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    canvas: {
        width: CUBE_SIZE * 4,
        height: CUBE_SIZE,
    },
});

function loadImage(src: string) {
    return new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = src;
    });
}

function getMousePos(canvas: HTMLElement, e: { clientX: number, clientY: number }) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

interface TextureProps extends WithStyles<typeof styles> {
    imageUrl: string;
    onLoading: (e: { origin: Texture }) => void;
    onLoaded: (e: { origin: Texture, }) => void;
    onClick: (e: {
        origin: Texture,
        x: number,
        y: number,
    }) => void;
}

class Texture extends React.Component<TextureProps, { isLoaded: boolean }> {
    rootRef = React.createRef<HTMLDivElement>();
    canvasRef = React.createRef<HTMLCanvasElement>();

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
        };

        this._handleClick = this._handleClick.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        imageUrl: PropTypes.string.isRequired,

        onLoading: PropTypes.func,
        onLoaded: PropTypes.func,
        onClick: PropTypes.func,
    };

    _updateImage() {
        const { imageUrl, onLoaded, onLoading } = this.props;

        this.setState({ isLoaded: false }, () => {
            onLoading && onLoading({ origin: this });
            loadImage(imageUrl)
                .then((i) => {
                    const cs = equirectToCubemapFaces(i, CUBE_SIZE);

                    this.setState({ isLoaded: true }, () => {
                        const context = this.canvasRef.current.getContext('2d');
                        context.drawImage(cs[5],
                            CUBE_SIZE / 2, // source x
                            0, // source y
                            CUBE_SIZE / 2, // source width
                            CUBE_SIZE, // source height
                            0, // destination x
                            0, // destination y
                            CUBE_SIZE / 2, // destination width
                            CUBE_SIZE // destination height
                        );
                        context.drawImage(cs[1], 0.5 * CUBE_SIZE, 0);
                        context.drawImage(cs[4], 1.5 * CUBE_SIZE, 0);
                        context.drawImage(cs[0], 2.5 * CUBE_SIZE, 0);

                        context.drawImage(cs[5],
                            0, // source x
                            0, // source y
                            CUBE_SIZE / 2, // source width
                            CUBE_SIZE, // source height
                            3.5 * CUBE_SIZE, // destination x
                            0, // destination y
                            CUBE_SIZE / 2, // destination width
                            CUBE_SIZE // destination height
                        );

                        onLoaded && onLoaded({ origin: this });
                    });
                });
        });
    }

    componentDidMount() {
        this._updateImage();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.imageUrl !== this.props.imageUrl) {
            this._updateImage();
        }
    }

    _handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { x, y } = getMousePos(this.rootRef.current, e);

        this.props.onClick && this.props.onClick({ origin: this, x: getX(x), y: getY(y) });
    }

    render() {
        const { classes } = this.props;
        const { isLoaded } = this.state;

        if (isLoaded) {
            return <div className={classes.root} ref={this.rootRef} style={{ width: CUBE_SIZE * 4, height: CUBE_SIZE }} onClick={this._handleClick}>
                <canvas width={CUBE_SIZE * 4} height={CUBE_SIZE} ref={this.canvasRef} className={classes.canvas}></canvas>
                {this.props.children}
            </div>;
        } else {
            return <div className={classes.rootLoading}>
                <CircularProgress size={48} />
            </div>;
        }
    }
}

export default withStyles(styles)(Texture);