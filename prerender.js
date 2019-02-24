import { JSDOM } from 'jsdom';
import fs from 'fs';

import renderer from "./src/library/renderer";
import Form from "./src/components/Form";

global.window = new JSDOM('').window;
global.document = global.window.document;

const container = document.createElement('div');

const appRenderer = renderer();
const formEl = Form({
    onInputChange: () => undefined,
    onSubmit: () => undefined,
    formData: {},
    errors: {},
    sending: false,
    result: undefined,
});
appRenderer.render(formEl, container);

const indexContent = fs.readFileSync('./dist/index.html', 'utf8');

fs.writeFileSync(
    './dist/index.html',
    indexContent.replace(
        '<!--[if PRERENDERING-PLACEHOLDER]-><![endif]-->',
        container.innerHTML,
    ),
);
