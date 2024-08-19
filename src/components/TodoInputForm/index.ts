import createTemplate from '../../helpers/createTemplate';
import { Todo } from '../../types';
import cssText from './TodoInputForm.css?raw';
import htmlText from './TodoInputForm.html?raw';

const template = createTemplate(cssText, htmlText);

class TodoInputForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const form = this.shadowRoot!.querySelector('form')!;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const todoText = formData.get('text') as string;
            const event = new CustomEvent<Todo>('submit', { detail: {
                id: Date.now(),
                text: todoText,
                completed: false
            } });
            this.dispatchEvent(event);
            const input = this.shadowRoot!.querySelector('input')!;
            input.value = '';
        });
    }

    disconnectedCallback() {

    }
}

customElements.define('todo-input-form', TodoInputForm);