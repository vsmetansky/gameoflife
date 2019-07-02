//class that represents a square matrix
export default class Matrix {
    constructor(dim) {
        this.dim = dim;
        this.element = document.createElement('table');
        while (dim--) {
            this.element.appendChild(new Row(this.dim).element);
        }
    }
    render(parentNode) {
        parentNode.innerHTML = '';
        parentNode.appendChild(this.element);
    }
}


class Row {
    constructor(length) {
        this.element = document.createElement('tr');
        while (length--) {
            this.element.appendChild(document.createElement('td'));
        }
    }
}