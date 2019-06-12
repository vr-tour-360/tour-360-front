import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { intlShape, injectIntl } from 'react-intl';
import { TextField, Button } from '@material-ui/core';
import { withStyles, WithStyles, StyleRulesCallback, Theme } from '@material-ui/core/styles';
import HintWidgetShape from './HintWidgetShape';
import { HEIGHT, WIDTH } from '../../utils';
import { HintWidget as HintWidgetModel } from "../../../../../../backend/src/models/interfaces";

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
});

interface HintWidgetEditPanelProps extends WithStyles<typeof styles> {
    widget: HintWidgetModel,
    intl: any;
    onXChanged: (event: { origin: HintWidgetEditPanel, widget: HintWidgetModel, x: number }) => void;
    onYChanged: (event: { origin: HintWidgetEditPanel, widget: HintWidgetModel, y: number }) => void;
    onContentChanged: (event: { origin: HintWidgetEditPanel, widget: HintWidgetModel, content: string }) => void;
    onDeleteClick: (event: { origin: HintWidgetEditPanel, widget: HintWidgetModel }) => void;
}

class HintWidgetEditPanel extends React.Component<HintWidgetEditPanelProps> {
    constructor(props) {
        super(props);

        this._handleXChanged = this._handleXChanged.bind(this);
        this._handleYChanged = this._handleYChanged.bind(this);
        this._handleContentChanged = this._handleContentChanged.bind(this);
        this._handleDeleteClick = this._handleDeleteClick.bind(this);
    }

    static propTypes = {
        widget: HintWidgetShape,
        onDeleteClick: PropTypes.func.isRequired,
        onXChanged: PropTypes.func.isRequired,
        onYChanged: PropTypes.func.isRequired,
        onContentChanged: PropTypes.func.isRequired,

        intl: intlShape,
    };

    _handleXChanged(e) {
        this.props.onXChanged({
            origin: this,
            x: parseInt(e.target.value),
            widget: this.props.widget,
        });
    }

    _handleYChanged(e) {
        this.props.onYChanged({
            origin: this,
            y: parseInt(e.target.value),
            widget: this.props.widget,
        });
    }

    _handleContentChanged(e) {
        this.props.onContentChanged({
            origin: this,
            content: e.target.value,
            widget: this.props.widget,
        });
    }

    _handleDeleteClick(e) {
        this.props.onDeleteClick({
            origin: this,
            widget: this.props.widget,
        });
    }

    render() {
        const { widget, classes } = this.props;
        const { messages, formatMessage } = this.props.intl;

        return <div className={classes.root}>
            <TextField
                label="Position X"
                value={widget.x}
                onChange={this._handleXChanged}
                type="number"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: WIDTH / 2,
                    min: - WIDTH / 2,
                    step: 25,
                }}
                fullWidth
                autoFocus
            />
            <TextField
                label="Position Y"
                value={widget.y}
                onChange={this._handleYChanged}
                type="number"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: HEIGHT / 2,
                    min: - HEIGHT / 2,
                    step: 25,
                }}
                fullWidth
            />
            <TextField
                label="Content"
                value={widget.content}
                onChange={this._handleContentChanged}
                margin="normal"
                fullWidth
            />
            <Button fullWidth variant="text" color="primary" onClick={this._handleDeleteClick}>
                {formatMessage(messages.delete)}
            </Button>
        </div>;
    }
}

export default withStyles(styles)(injectIntl(observer(HintWidgetEditPanel)));
