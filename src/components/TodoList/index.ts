import { effect, reactive, Reactive } from '@vue/reactivity';
import createTemplate from '../../helpers/createTemplate';
import { Todo } from '../../types';
import cssText from './TodoList.css?raw';
import htmlText from './TodoList.html?raw';
import '../TodoInputForm';
import '../TodoItem';
import Flip from '../../helpers/Flip';
import { animate } from '../../helpers/animate';
import { EventListener } from '../../types';

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
    private listElement: HTMLUListElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const todo = loadTodo();
        this.todo = reactive(todo);
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
        this.listElement = this.shadowRoot!.querySelector<HTMLUListElement>('.todo-list')!;
        this.flip = new Flip(this.listElement, {
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
        this.listElement.addEventListener('delete', ((e: CustomEvent<Todo>) => {
            const { id } = e.detail;
            this.todo.splice(this.todo.findIndex(todo => todo.id === id), 1);
        }) as EventListener, false);

        this.listElement.addEventListener('toggle', ((e: CustomEvent<Todo>) => {
            const { id } = e.detail;
            const todo = this.todo.find(todo => todo.id === id);

            if (todo) {
                todo.completed = !todo.completed;
            }
        }) as EventListener, false);

        effect(() => {
            this.render();
            localStorage.setItem('todos', JSON.stringify(this.todo));
        });
        
        // listen to the custom submit event from the todo-input-form
        this.shadowRoot!.querySelector('todo-input-form')!.addEventListener('submit', ((e: CustomEvent<Todo>) => {
            const todo = e .detail;
            this.todo.push(todo);
        }) as EventListener);
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

            // todoItem.addEventListener('delete', ((e: CustomEvent<Todo>) => {
            //     const { id } = e.detail;
            //     this.todo.splice(this.todo.findIndex(todo => todo.id === id), 1);
            // }) as EventListener);

            // todoItem.addEventListener('toggle', ((e: CustomEvent<Todo>) => {
            //     const { id } = e.detail;
            //     const todo = this.todo.find(todo => todo.id === id);

            //     if (todo) {
            //         todo.completed = !todo.completed;
            //     }
            // }) as EventListener);

            todoItem.style.display = 'block';
            todoList.appendChild(todoItem);
        });
    }
}

customElements.define('todo-list', TodoList);

export default TodoList;