import PropTypes from 'prop-types';

export default PropTypes.shape<any>({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
});
