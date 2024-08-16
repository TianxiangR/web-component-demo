import ReactiveHTMLElement from "../core/ReactiveHTMLElement";
import { Todo } from "../types";
import TodoInputForm from "./TodoInputForm";
import TodoList from "./TodoList";

export interface MainPageProps {}

export interface MainPageState {
    todoList: Todo[];
}

class MainPage extends ReactiveHTMLElement<MainPageProps, MainPageState> {
    constructor(props: MainPageProps) {
        super(props);
    }

    getInitialState(): MainPageState {
        return {
            todoList: [],
        };
    }
    

    addTodo = (todo: Todo) => {
        this.state.todoList.push(todo);
    }

    render() {
        const inputForm = new TodoInputForm({
            onSubmit: this.addTodo,
        });
        this.shadow.appendChild(inputForm);
        const todoList = new TodoList({
            todoList: this.state.todoList,
        });
        this.shadow.appendChild(todoList);
    }
}

customElements.define('main-page', MainPage);

export default MainPage;