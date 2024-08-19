export type PositionInfo = {
    relativeTop: number;
    relativeLeft: number;
    width: number;
    height: number;
    element: HTMLElement;
}

export type FlipOptions = {
    flipIdAttr: string;
    duration: number;
    easing: string;
    onStart?: () => void;
    onComplete?: () => void;
    onAppear?: (element: HTMLElement, index: number) => void;
    onExit?: (element: HTMLElement, index: number, removeElement: () => void) => void;
}

class Flip {
    private parent: HTMLElement;
    private positionSnapshot: Record<string, PositionInfo> | null = null;
    private flipOptions: FlipOptions;
    private inProgressAnimations: Animation[] = [];

    static defaultFlipOptions: FlipOptions = {
        flipIdAttr: 'data-flip-id',
        duration: 300,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
    }

    constructor(parent: HTMLElement, flipOptions: Partial<FlipOptions> = {}) {
        this.parent = parent;
        this.flipOptions = {
            ...Flip.defaultFlipOptions,
            ...flipOptions,
        };
        this.flipOptions.flipIdAttr = String(this.flipOptions.flipIdAttr);
    }

    private cancelInprogressAnimations() {
        this.inProgressAnimations.forEach((animation) => {
            animation.cancel();
        });
        this.inProgressAnimations = [];
    }

    takePositionSnapshot() {
        this.positionSnapshot = {};
        if (getComputedStyle(this.parent).position === 'static') {
            this.parent.style.position = 'relative';
        }
        const elements = this.parent.querySelectorAll(`[${this.flipOptions.flipIdAttr}]`);
        (Array.from(elements) as HTMLElement[]).forEach((element) => {
            const id = element.getAttribute(this.flipOptions.flipIdAttr);
            if (id === null) return;
            const { top, left, width, height } = element.getBoundingClientRect();
            const {top: pTop, left: pLeft} = this.parent.getBoundingClientRect();
            this.positionSnapshot![id] = { relativeTop: top - pTop, relativeLeft: left - pLeft, width, height, element };
        });
    }

    play() {
        if (!this.positionSnapshot) return;
        this.cancelInprogressAnimations();
        this.flipOptions.onStart?.();

        const idsFromSnapshot = new Set(Object.keys(this.positionSnapshot));
        const elements = Array.from(this.parent.querySelectorAll(`[${this.flipOptions.flipIdAttr}]`)) as HTMLElement[];
        const currentIds = new Set(elements.map((element) => element.getAttribute(this.flipOptions.flipIdAttr)));

        // adding the removed elements to the array
        idsFromSnapshot.forEach((id) => {
            if (!currentIds.has(id)) {
                elements.push(this.positionSnapshot![id].element);
            }
        });

        const animPromises: Promise<void>[] = [];
        elements.forEach((element, index) => {
            const id = element.getAttribute(this.flipOptions.flipIdAttr);
            if (id === null) return;
            const { top, left, width, height } = element.getBoundingClientRect();
            const {top: pTop, left: pLeft} = this.parent.getBoundingClientRect();
            const relativeTop = top - pTop;
            const relativeLeft = left - pLeft;
            const oldRect = this.positionSnapshot![id];

            if (getComputedStyle(this.parent).position === 'static') {
                this.parent.style.position = 'relative';
            }

            if (!idsFromSnapshot.has(id)) {
                if (this.flipOptions.onAppear) {
                    this.flipOptions.onAppear(element, index);
                }
                return;
            }

            if (!currentIds.has(id)) {
                if (this.flipOptions.onExit) {
                    // insert element back to dom

                    element.style.position = 'absolute';
                    element.style.top = `${oldRect.relativeTop}px`;
                    element.style.left = `${oldRect.relativeLeft}px`;
                    element.style.width = `${oldRect.width}px`;
                    element.style.height = `${oldRect.height}px`;
                    this.parent.appendChild(element);

                    this.flipOptions.onExit(element, index, () => {
                        this.parent.removeChild(element);
                    });
                }
                return
            }

            if (!oldRect) return;
            const deltaX = oldRect.relativeLeft - relativeLeft;
            const deltaY = oldRect.relativeTop - relativeTop;

            const promise = new Promise<void>((resolve) => {
                const animation = element.animate([
                    { 
                        transform: `translate(${deltaX}px, ${deltaY}px)`,
                        width: `${oldRect.width}px`,
                        height: `${oldRect.height}px`
                    },
                    { 
                        transform: 'translate(0, 0)',
                        width: `${width}px`,
                        height: `${height}px`
                    }
                ], {
                    duration: this.flipOptions.duration,
                    easing: this.flipOptions.easing,
                });

                const removeAnimation = () => {
                    const index = this.inProgressAnimations.indexOf(animation);
                    if (index !== -1) {
                        this.inProgressAnimations.splice(index, 1);
                    }
                    resolve();
                }

                animation.addEventListener('finish', removeAnimation, { once: true });
                animation.addEventListener('cancel', removeAnimation, { once: true });
                animation.addEventListener('remove', removeAnimation, { once: true });
                
                this.inProgressAnimations.push(animation);
            });

            animPromises.push(promise);
        });

        Promise.all(animPromises).then(() => {
            this.flipOptions.onComplete?.();
        });
    }
}

export default Flip;