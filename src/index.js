import "babel-polyfill";
import "whatwg-fetch";

import renderer from "./library/renderer";
import Form from "./components/Form";
import validate from "./validate";
import send from "./send";

let state = {
    formData: { name: undefined, text: undefined, reply: false, email: undefined },
    errors: {},
    sending: false,
    result: undefined,
};

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
        errors: validate(state.formData, true),
        sending: true,
    };

    if (Object.values(state.errors).find((e) => e !== undefined)) {
        state = { ...state, sending: false };
        renderApp(state);
        return;
    }

    renderApp(state);
    send(e.target.action, state.formData)
        .then((result) => {
            state = { ...state, sending: false, result };
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
