export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export interface TodoSubmitEvent extends CustomEvent<Todo> {}

export type EventListener = (this: Element, ev: Event) => any;