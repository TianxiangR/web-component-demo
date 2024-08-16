import ReactiveHTMLElement from "../core/ReactiveHTMLElement";
import { Todo } from "../types";

export interface TodoItemProps {
    todo: Todo
    checked: boolean
    onCheckChanged: (checked: boolean) => void
    
}

class TodoItem extends ReactiveHTMLElement<TodoItemProps> {
    constructor(props: TodoItemProps) {
        super(props);
    }
    render() {
        this.shadow.innerHTML = `
            <li>${this.props.todo.text}</li>
        `;
    }
}