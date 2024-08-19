import { effect, reactive, Reactive } from '@vue/reactivity';
import createTemplate from '../../helpers/createTemplate';
import { Todo } from '../../types';
import cssText from './TodoList.css?raw';
import htmlText from './TodoList.html?raw';
import '../TodoInputForm';
import '../TodoItem';
import Flip from '../../helpers/Flip';
import { animate } from '../../helpers/animate';

function loadTodo(): Todo[] {
    const todoFromStorage = JSON.parse(localStorage.getItem('todos') || '[]');
    if (Array.isArray(todoFromStorage)) {
        return todoFromStorage;
    }
    return [];
}

const template = createTemplate(cssText, htmlText);

class TodoList extends HTMLElement {
    private todo: Reactive<Todo[]>;
    private flip: Flip;
    private isInitialRender = true;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const todo = loadTodo();
        this.todo = reactive(todo);
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
        const todoList = this.shadowRoot!.querySelector<HTMLUListElement>('.todo-list')!;
        this.flip = new Flip(todoList, {
            flipIdAttr: 'data-flip-id',
            onAppear: (element) => {
                element.style.transformOrigin = 'center';
                element.animate([
                    {
                        opacity: 0,
                        transform: 'scale(0)',
                    },
                    {
                        opacity: 1,
                        transform: 'scale(1)',
                    }
                ], {
                    duration: 250,
                });
            },
            onExit: async (element, _index, removeElement) => {
                element.style.transformOrigin = 'center';
                await animate(element, [
                    {
                        opacity: 1,
                        transform: 'scale(1)',
                    },
                    {
                        opacity: 0,
                        transform: 'scale(0)',
                    }
                ], {
                    duration: 150,
                });
                removeElement();
            }
        });
    }

    connectedCallback() {
        effect(() => {
            this.render();
            localStorage.setItem('todos', JSON.stringify(this.todo));
        });
        this.shadowRoot!.querySelector('todo-input-form')!.addEventListener('submit', (e: Event) => {
            if (!(e instanceof CustomEvent)) return;
            const todo = (e as CustomEvent<Todo>).detail;
            this.todo.push(todo);
        });
    }

    render() {
        if (!this.isInitialRender) {
            this.flip.takePositionSnapshot();
        } else {
            this.isInitialRender = false;
        }

        this.renderList();
        this.flip.play();

    }

    renderList() {
        const todoList = this.shadowRoot!.querySelector<HTMLUListElement>('.todo-list')!;
        todoList.innerHTML = '';
        this.todo.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            return b.id - a.id;
        });
        this.todo.forEach((todo) => {
            const todoItem = document.createElement('todo-item');
            todoItem.dataset.todo = JSON.stringify(todo);
            todoItem.dataset.flipId = String(todo.id);

            todoItem.addEventListener('delete', (e) => {
                if (!(e instanceof CustomEvent)) return;
                const { id } = (e as CustomEvent<Todo>).detail;
                this.todo.splice(this.todo.findIndex(todo => todo.id === id), 1);
            });

            todoItem.addEventListener('toggle', (e) => {
                if (!(e instanceof CustomEvent)) return;
                const { id } = (e as CustomEvent<Todo>).detail;
                const todo = this.todo.find(todo => todo.id === id);
                console.log('toggled', todo);
                if (todo) {
                    todo.completed = !todo.completed;
                }
            });

            todoItem.style.display = 'block';
            todoList.appendChild(todoItem);
        });
    }
}

customElements.define('todo-list', TodoList);

export default TodoList;