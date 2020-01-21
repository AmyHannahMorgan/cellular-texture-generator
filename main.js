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
const poissons = [];

const stepDelay = 1;
const startingRadius = 2;
const radiusStep = 1

for(let x = 0; x < canvas.width; x++) {
    let ar = [];
    for(let y = 0; y < canvas.height; y++) {
        ar.push(new Point(x, y, 0));
    }
}

let step = 0;

while(!checkVisitedPercentage(points)) {
    if(step === stepDelay) {
        
    }
    else if(poissons.length === 0) {
        poissons.push(new Psudopoisson(RNG(0, canvas.width), RNG(0, canvas.height), 0, startingRadius, radiusStep));
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