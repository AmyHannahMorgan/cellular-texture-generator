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

const points = [];

for(let x = 0; x < canvas.height; x++) {
    let ar = [];
    for(let y = 0; y < canvas.height; y++) {
        ar.push(new Point(x, y, 0));
    }
}

function RNG(min, max) {
    max = Math.ceil(max);
    min = Math.floor(min);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}