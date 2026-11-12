
export function $(selector, root) {
    if (root === undefined) {
        root = document;
    }
    return root.querySelector(selector);
}

export function $$(selector, root) {
    if (root === undefined) {
        root = document;
    }
    return Array.from(root.querySelectorAll(selector));
}
