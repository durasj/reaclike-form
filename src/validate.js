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

export default validate;
