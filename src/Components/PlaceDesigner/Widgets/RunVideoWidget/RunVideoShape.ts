import PropTypes from 'prop-types';

export default PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    muted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
});
