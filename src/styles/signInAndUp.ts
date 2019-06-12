import { grey, blue } from '@material-ui/core/colors';

export default theme => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: grey[100],
    },
    panel: {
        display: 'flex',
        flexDirection: 'column',
        width: '450px',
        backgroundColor: '#fff',
        border: `1px solid ${grey[300]}`,
        padding: '40px 15px',
        borderRadius: 5,
    },
    title: {
        color: blue[500],
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    link: {
        alignSelf: 'center',
        textDecoration: 'none',
        color: blue[500],
        textTransform: 'uppercase',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    profile: {
        position: 'relative',
    },
    hr: {
        backgroundColor: grey[300],
        border: 'none',
        height: 1,
        width: '100%',
        margin: '20px 0'
    },
    profileHr: {
        backgroundColor: grey[300],
        border: 'none',
        height: 1,
        width: '100%',
        position: 'absolute',
        top: 'calc(50% - 5px)',
    },
    profileImg: {
        width: '25%',
        display: 'block',
        margin: 'auto',
        borderRadius: '50%',
        backgroundColor: '#fff',
        zIndex: 2,
        position: 'relative',
        border: '10px solid white'
    },
    ReCAPTCHA: {
        margin: '20px auto 0'
    },
    inputsGroup: {
        display: 'flex',
        margin: '10px 0'
    },
    passwordInput: {
        marginRight: 10
    },
    confirmationPasswordInput: {
        marginLeft: 10
    },
    firstNameInput: {
        marginRight: 10
    },
    lastNameInput: {
        marginLeft: 10
    },
});