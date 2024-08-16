import ReactiveHTMLElement from "../core/ReactiveHTMLElement";
import { Todo } from "../types";

export interface TodoListProps {
    todoList: Todo[];
}

class TodoList extends ReactiveHTMLElement<TodoListProps> {
    constructor(props: TodoListProps) {
        super(props);
    }

    render() {
        this.shadow.innerHTML = `
            <ul>
                ${this.props.todoList.map(todo => `
                    <li>${todo.text}</li>
                `).join('\n')}
            </ul>
        `;
    }
}

customElements.define('todo-list', TodoList);

export default TodoList;