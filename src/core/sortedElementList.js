export default class SortedElementList {
    constructor(element, compareFunction) {
        this.items = [];
        this.element = element;
        this.compareFunction = compareFunction;
    }

    add(item) {
        var index = this.getIndex(item);
        var sibling = this.items[index];
        this.items.splice(index, 0, item);
        this.element.insertBefore(item.element, sibling && sibling.element);
    }

    get(compareFunction) {
        return this.items.find(compareFunction);
    }

    getIndex(item) {
        if (!this.compareFunction) {
            return this.items.length;
        }

        for (var i = this.items.length - 1; i >= 0; i--) {
            if (this.compareFunction(item, this.items[i])) {
                return i + 1;
            }
        }

        return 0;
    }

    removeBy(compareFunction) {
        var index = this.items.findIndex(compareFunction);
        if (index >= 0) {
            this.items.splice(index, 1)[0].element.remove();
        }
    }
}