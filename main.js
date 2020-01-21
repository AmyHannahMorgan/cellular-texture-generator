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

function checkVisitedPercentage(ar) {
    let total = ar.length * ar[0].length;
    let acc = 0;
    ar.map((y) => {
        y.map((point) => {
            if(point.visited) {
                acc++;
            }
        });
    });

    if(acc / total >= 0.9) return true;
    else return false;
}
function RNG(min, max) {
    max = Math.ceil(max);
    min = Math.floor(min);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}