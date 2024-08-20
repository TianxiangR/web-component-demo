import createTemplate from '../../helpers/createTemplate';
import { Todo } from '../../types';
import cssText from './TodoItem.css?raw';
import htmlText from './TodoItem.html?raw';

const template = createTemplate(cssText, htmlText);

class TodoItem extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['data-todo'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'todo' && oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
        const deleteButton = this.shadowRoot!.querySelector('button')!;
        const todo = JSON.parse(this.dataset.todo || '{}');
        deleteButton.addEventListener('click', () => {
            // Dispatch a custom delete event with the todo object
            const event = new CustomEvent('delete', { detail: todo, bubbles: true });
            this.dispatchEvent(event);
        });

        const input = this.shadowRoot!.querySelector('input')!;
        input.addEventListener('change', () => {

            // Dispatch a custom toggle event with the todo object
            const event = new CustomEvent('toggle', { detail: todo, bubbles: true });
            this.dispatchEvent(event);
        });
    }

    render() {
        const todo: Todo = JSON.parse(this.dataset.todo || '{}');
        this.shadowRoot!.innerHTML = '';
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
        const text = this.shadowRoot!.querySelector<HTMLSpanElement>('.todo-text')!;
        text.innerText = todo?.text || '';
        const input = this.shadowRoot!.querySelector<HTMLInputElement>('input')!;
        input.checked = todo?.completed || false;
    }
}

customElements.define('todo-item', TodoItem);

export default TodoItem;