class Psudopoisson {
    constructor(x, y, z, radius, step) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius
        this.step = step;
    }
}

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.visited = false;
        this.value = 0;
    }
}

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');