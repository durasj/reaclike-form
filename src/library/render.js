/**
 * Render selected element to the container
 *
 * Does deep rendering
 *
 * @param {{ tagName: string, attributes: {[key: string]: any}, children: [] }} element 
 * @param {Element} container
 */
function renderRoot(element, container) {
    if (!(container instanceof Element)) {
        throw Error('Container is not a DOM element.');
    }
    if (!element || !element.tagName || !element.children) {
        throw Error('Only elements created with createElement can be rendered.');
    }

    container.innerHTML = '';

    render(element, container);
}

function renderChildren(domElement, children) {
    if (typeof children[0] === 'string') {
        domElement.innerText = children[0];
        return domElement;
    }

    for (const child of children) {
        if (!child) {
            continue;
        }

        if (!child.tagName || !child.children) {
            throw Error('More than one non-text child must be created with createElement.');
        }

        render(child, domElement);
    }

    return domElement;
}

function render(element, container) {
    const renderedEl = document.createElement(element.tagName);
    for (const attr of Object.entries(element.attributes)) {
        if (attr[1] === undefined) {
            continue;
        }

        // Add on* attributes as event handlers
        if (attr[0].indexOf('on') === 0) {
            let eventName = attr[0].replace('on', '');
            eventName = eventName[0].toLowerCase() + eventName.substr(1);
            renderedEl.addEventListener(eventName, attr[1]);
            continue;
        }

        renderedEl.setAttribute(attr[0], attr[1]);
    }

    container.appendChild(
        renderChildren(renderedEl, element.children),
    );
}

export default renderRoot;
