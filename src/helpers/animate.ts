export function animate(
    el: HTMLElement,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options?: number | KeyframeAnimationOptions
): Promise<void> {
    return new Promise(resolve => {
        const anim = el.animate(keyframes, options);
        const res = () => resolve();
        anim.addEventListener('finish', res, { once: true });
        anim.addEventListener('cancel', res, { once: true });
        anim.addEventListener('remove', res, { once: true });
    });
}