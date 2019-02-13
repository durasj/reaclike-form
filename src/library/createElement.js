function createElement(tagName, attributes = {}, ...children) {
    return {
        tagName,
        attributes,
        children,
    };
}

export default createElement;
