function createTemplate(cssText: string, htmlText: string): HTMLTemplateElement {
    const template = document.createElement('template');
    template.innerHTML = /*html*/`
        <style>
            ${cssText}
        </style>
        ${htmlText}
    `;
    return template;
}

export default createTemplate;