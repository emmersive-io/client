export default function (name, className) {
    return `<svg class="icon ${className || ''}" aria-hidden="true"><use xlink:href="#${name}"></use></svg>`;
}