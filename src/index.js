import renderer from "./library/renderer";
import Form from "./components/Form";

let state = {
    formData: { name: undefined, text: undefined, reply: false, email: undefined },
    errors: {},
    sending: false,
    result: undefined,
};

const validate = (formData, force) => Object.entries(formData).reduce((acc, entry) => {
    const key = entry[0];
    const value = entry[1];
    const required = key === 'text' || (key === 'email' && formData.reply);
    const isEmpty = force ? !value : value === '';
    acc[key] = required && isEmpty ? 'Field is required' : undefined;
    if (key === 'email' && acc[key] === undefined && typeof value === 'string') {
        // https://www.w3.org/TR/2012/WD-html-markup-20120320/input.email.html#input.email.attrs.value.single
        const isEmail = value.match(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        );
        acc[key] = !isEmail ? 'Invalid email address' : undefined;
    }
    return acc;
}, {});

const onInputChange = (inputName, value) => {
    state = {
        ...state,
        formData: {
            ...state.formData,
            [inputName]: value,
        },
        errors: validate({ ...state.formData, [inputName]: value }),
        result: undefined,
    };

    renderApp(state);
};

const onSubmit = (e) => {
    e.preventDefault();

    state = {
        ...state,
        formData: state.formData,
        errors: validate(state.formData, true),
        sending: true,
    };

    if (Object.values(state.errors).find((e) => e !== undefined)) {
        state = { ...state, sending: false };
        renderApp(state);
        return;
    }

    fetch('https://www.enformed.io/8j7kjppl/', {
        method: 'POST',
        body: JSON.stringify(state.formData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((response) => {
            state = { ...state, sending: false, result: {
                success: true,
                message: response.data,
            } };
            renderApp(state);
        })
        .catch((error) => {
            console.error(error);
            state = { ...state, sending: false, result: {
                success: false,
                message: 'There was an error. Please try it again.',
             } };
            renderApp(state);
        });
}

const appRenderer = renderer();
function renderApp(state) {
    const formEl = Form({
        onInputChange,
        onSubmit,
        formData: state.formData,
        errors: state.errors,
        sending: state.sending,
        result: state.result,
    });
    appRenderer.render(formEl, document.getElementById('form-wrapper'));
}
renderApp(state);
