import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { intlShape, injectIntl } from 'react-intl';
import { Editor } from 'react-draft-wysiwyg';
import './../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DialogTitleWithClose from './DialogTItleWithClose';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

interface HtmlEditDialogProps {
    intl: any;
    title: string;
    isOpened: boolean; 
    onSaveClick: (e: { origin: HtmlEditDialog, htmlContent: string }) => void;
    onCancelClick: (e: { origin: HtmlEditDialog }) => void;
    onClose: (e: { origin: HtmlEditDialog }) => void;
}

class HtmlEditDialog extends React.Component<HtmlEditDialogProps, any> {
    constructor(props) {
        super(props);

        this._handleClose = this._handleClose.bind(this);
        this._handleSaveClick = this._handleSaveClick.bind(this);
        this._handleCancelClick = this._handleCancelClick.bind(this);

        this.state = {
            editorState: this._createFromHtml(props.htmlContent || ""),
        };
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        htmlContent: PropTypes.string,
        okButtonText: PropTypes.string,
        onSaveClick: PropTypes.func.isRequired,
        isOpened: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    
        intl: intlShape.isRequired,
    };

    _createFromHtml(htmlContent) {
        const contentBlock = htmlToDraft(htmlContent);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);

            return editorState;
        } else {
            return EditorState.createEmpty();
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    _handleSaveClick() {
        const htmlContent = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        this.props.onSaveClick({ origin: this, htmlContent });
    }

    _handleCancelClick() {
        this.props.onCancelClick({origin: this});
    }

    _handleClose() {
        this.props.onClose({ origin: this });
    }

    render() {
        const { isOpened, title } = this.props;
        const { editorState } = this.state;
        const { messages, formatMessage } = this.props.intl;

        return (
            <Dialog
                onClose={this._handleClose}
                open={isOpened}
                maxWidth={'sm'}
                fullWidth>
                <DialogTitleWithClose onClose={this._handleClose}>{title}</DialogTitleWithClose>
                <DialogContent>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={this.onEditorStateChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleSaveClick} color="primary" variant="contained" autoFocus>{formatMessage(messages.save)}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default injectIntl(HtmlEditDialog);
