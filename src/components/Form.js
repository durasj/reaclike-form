import "./Form.css";
import createElement from "../library/createElement";
import Field from "./Field";

function Form({ onInputChange, onSubmit, formData, errors, sending, result }) {
    const onChange = (e) => {
        let inputName = e.target.id.replace('message', '');
        inputName = inputName[0].toLowerCase() + inputName.substr(1);
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        onInputChange(inputName, value);
    };

    const headingEl = createElement('h1', {}, 'Contact');
    const descriptionEl = createElement('p', {}, 'Send us a message');
    const nameField = Field({
        id: 'messageName',
        label: 'Name',
        type: 'text',
        value: formData.name,
        error: errors.name,
        onChange,
});
    const messageField = Field({
        id: 'messageText',
        label: 'Message',
        type: 'textarea',
        value: formData.text,
        error: errors.text,
        required: true,
        onChange,
    });
    const replyField = Field({
        id: 'messageReply',
        label: 'Require reply',
        type: 'checkbox',
        value: formData.reply,
        error: errors.reply,
        onChange,
    });
    const emailField = Field({
        id: 'messageEmail',
        label: 'Email',
        type: 'email',
        value: formData.email,
        error: errors.email,
        required: formData.reply === true,
        onChange,
    });
    const buttonEl = createElement(
        'button',
        { type: 'submit', disabled: sending ? true : undefined },
        sending ? 'Sending...' : 'Send',
    );
    const resultEl = result ? createElement(
        'p',
        { class: `result ${result.success ? 'success' : 'error'}` },
        result.message,
    ) : undefined;

    const formEl = createElement(
        "form",
        { onSubmit: onSubmit, novalidate: true },
        headingEl,
        descriptionEl,
        nameField,
        messageField,
        replyField,
        emailField,
        buttonEl,
        resultEl,
    );

    return formEl;
}

export default Form;
