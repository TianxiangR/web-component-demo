import { effect, Reactive, reactive } from "@vue/reactivity";

class ReactiveHTMLElement<TProps extends object = any, TState extends object = any> extends HTMLElement {
    protected shadow: ShadowRoot;
    protected state: Reactive<TState>;
    protected effectFn!: ReturnType<typeof effect>;
    props: Reactive<TProps>;

    constructor(props: TProps) {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.state = reactive(this.getInitialState());
        this.props = reactive(props);
       
    }

    connectedCallback() {
        this.effectFn = effect(() => { this.render() });
    }

    protected getInitialState() {
        return {} as TState;
    }

    protected render() {}

}

export default ReactiveHTMLElement;