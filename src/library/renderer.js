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

    if (this.prevTree !== undefined) {
        rerender(element, this.prevTree, container.firstChild, container);
    } else {
        render(element, container);
    }

    this.prevTree = element;
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

    if (container) {
        container.appendChild(
            renderChildren(renderedEl, element.children),
        );
    } else {
        return renderChildren(renderedEl, element.children);
    }
}

function rerender(element, prevElement, domNode, container) {
    // We are trying to change as little as possible in the real DOM

    // This element wasn't previously but is now
    if (!prevElement && element) {
        console.warn('Adding subtree', element);
        render(element, container);
        return;
    }

    // This element was previously but isn't now
    if (prevElement && !element) {
        console.warn('Removing subtree', element);
        container.removeChild(domNode);
        return;
    }

    // We have string
    if (typeof element === 'string') {
        if (element === prevElement) {
            return;
        }
        console.warn('Replacing with string', element);
        container.replaceChild(domNode, document.createTextNode(element));
        return;
    }

    // Element tag changed - replace
    if (prevElement.tagName !== element.tagName) {
        console.warn('Changing subtree', element);
        container.replaceChild(domNode, renderChildren(container, element.children));
        return;
    }

    // Element props possibly changed
    for (const [attrKey, attrValue] of Object.entries(element.attributes)) {
        // Always skip event listeners - we won't rebind them
        if (prevElement.attributes[attrKey] !== attrValue && attrKey.indexOf('on') !== 0) {
            console.warn('Rerendering attribute', element, attrKey);
            domNode.setAttribute(attrKey, attrValue);
        }
    }

    // Apply rerendering to all children
    const maxChildren = Math.max(element.children.length, prevElement.children.length);
    for (let i = 0; i < maxChildren; i++) {
        if ((!element.children[i] && !prevElement.children[i])){
            continue;
        } 

        rerender(
            element ? element.children[i] : undefined,
            prevElement ? prevElement.children[i] : undefined,
            domNode.children[i],
            domNode,
        );
    }
}

export default () => ({
    prevTree: undefined,
    render: renderRoot,
})
