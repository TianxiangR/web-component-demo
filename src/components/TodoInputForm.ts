import ReactiveHTMLElement from "../core/ReactiveHTMLElement";
import { Todo } from "../types";

export interface TodoInputFormProps {
    onSubmit?: (todo: Todo) => void;
}

export interface TodoInputFormState {
    inputValue: string;
}

class TodoInputForm extends ReactiveHTMLElement<TodoInputFormProps, TodoInputFormState> {

    constructor(props?: TodoInputFormProps) {
        super(props || {});
        this.shadow.innerHTML = `
            <form>
                <input type="text" placeholder="What needs to be done?"/>
                <button type="submit">Add</button>
            </form>
        `;
    }

    connectedCallback(): void {
        super.connectedCallback();
        const form = this.shadow.querySelector('form');
        const input = this.shadow.querySelector('input');
        form?.addEventListener('submit', (event) => {
            event.preventDefault();
            const newTodo = { id: Date.now(), text: this.state.inputValue, completed: false }
            this.props?.onSubmit?.(newTodo);
            input && (input.value = '');
        });

        
        input?.addEventListener('input', (event) => {
            this.state.inputValue = (event.target as HTMLInputElement).value;
        });
    }


    getInitialState(): TodoInputFormState {
        return {
            inputValue: '',
        };
    }

    render() {


    }
}

customElements.define('todo-input-form', TodoInputForm);

export default TodoInputForm;