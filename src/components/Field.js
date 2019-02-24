import './Field.css';
import createElement from "../library/createElement";

function Field({ id, label, type, value, error, required, onChange }) {
    let tagName = 'input';
    let attrs = { id, onChange, required: required === true ? true : undefined };
    if (type === 'textarea') {
        tagName = 'textarea';
    } else if (type === 'checkbox') {
        attrs.type = type;
        if (value === true) {
            attrs.checked = 'checked';
        }
    } else {
        attrs.type = type;
        attrs.value = value || '';
    }

    const classes = [
        'field',
        type === 'checkbox' ? 'checkbox' : undefined,
        error ? 'has-error' : undefined,
    ].filter(c => !!c).join(' ');
    const child = tagName === 'textarea' ? value || '' : undefined;
    const requiredAsterisk = required === true ? '* ' : '';
    const colon = type === 'checkbox' ? '' : ':';
    const labelText = `${requiredAsterisk}${label}${colon}`;

    const fieldEl = createElement(
        'div',
        { class: classes },
        createElement('label', { for: id }, labelText),
        createElement(tagName, attrs, child),
        error ? createElement('p', { class: 'feedback' }, error) : undefined,
    );

    return fieldEl;
}

export default Field;
