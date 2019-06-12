import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {
    List,
    ListItem,
    ListSubheader,
} from "@material-ui/core";
import classnames from "classnames";
import { grey } from '@material-ui/core/colors';

const styles = (theme: Theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${grey[300]}`,
    },
});

interface CategoryProps extends WithStyles<typeof styles> {
    title: string;
    className: string;
}

class Category extends React.Component<CategoryProps> {
    static propTypes = {
        title: PropTypes.string.isRequired,
        className: PropTypes.string,
        classes: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { classes, className, title } = this.props;

        const root = classnames({
            [classes.root]: true,
            [className]: !!className,
        });

        return <List
            className={root}
            subheader={<ListSubheader>{title}</ListSubheader>}
        >
            <ListItem>
                {this.props.children}
            </ListItem>
        </List>;
    }
}

export default withStyles(styles)(Category);
