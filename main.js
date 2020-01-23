class Psudopoisson {
    constructor(x, y, z, radius, step) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.active = true;
        this.updated = false;
        this.radius = radius
        this.step = step;
    }

    update(peers) {
        this.updated = true;
        let flag = true
        let distanceToSide = this.x < canvas.width / 2 ? this.x : canvas.width - this.x;
        let distanceToEnds = this.y < canvas.height / 2 ? this.y : canvas.height - this.y;

        if(this.radius + this.step >= distanceToEnds || this.radius + this.step >= distanceToSide) flag = false;

        let collisions = []
        let closestCollion = null;

        peers.map((peer) => {
            let distance = Math.sqrt((this.x - peer.x)**2 + (this.y - peer.y)**2);

            if(distance - this.radius - peer.radius - this.step - peer.step <= 0) {
                flag = false;

                collisions.push(peer);

                if(closestCollion !== null) {
                    let ccDistance = Math.sqrt((this.x - closestCollion.x)**2 + (this.y - closestCollion.y)**2) - closestCollion.radius;
                    let newCollisionDistance = distance - peer.radius;
                    if(newCollisionDistance < ccDistance) closestCollion = peer;
                }
                else closestCollion = peer;
            }
        });

        if(flag) {
            this.nextRadius = this.radius + this.step;
        }
        else {
            this.active = false;
            if(closestCollion !== null) {
                let ccDistance = Math.sqrt((this.x - closestCollion.x)**2 + (this.y - closestCollion.y)**2);
    
                if(ccDistance - closestCollion.radius < distanceToSide && ccDistance - closestCollion.radius < distanceToEnds) {
                    let overlap = ccDistance - this.radius - closestCollion.radius - this.step - closestCollion.step;
    
                    if(overlap !== 0) {
                        this.nextRadius = this.radius + overlap / 2;
                    }
                }
                else {
                    if(distanceToEnds <= distanceToSide) {
                        this.nextRadius = this.radius + (distanceToEnds - this.radius);
                    }
                    else if(distanceToSide < distanceToEnds) {
                        this.nextRadius = this.radius + (distanceToSide - this.radius);
                    }
                }
            }
            else {
                if(distanceToEnds <= distanceToSide) {
                    this.nextRadius = this.radius + (distanceToEnds - this.radius);
                }
                else if(distanceToSide < distanceToEnds) {
                    this.nextRadius = this.radius + (distanceToSide - this.radius);
                }
            }
        }
    }

    apply() {
        this.radius = this.nextRadius;
        this.nextRadius = 0;
        this.updated = false;
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

const debug = false;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const points = [];
const poissons = [];

const stepDelay = 10;
const startingRadius = 2;
const radiusStep = 1

for(let x = 0; x < canvas.width; x++) {
    let ar = [];
    for(let y = 0; y < canvas.height; y++) {
        ar.push(new Point(x, y, 0));
    }
    points.push(ar);
}

let step = 0;

if(debug) {
    while(poissons.length < 20) {
        let point = findSafePoint(poissons, points);
        poissons.push(new Psudopoisson(point.x, point.y, 0, startingRadius, radiusStep));
    }

    while(checkActivePoissons(poissons)) {
        poissons.map((disc, i) => {
            let peers = [...poissons]
            peers.splice(i,1);
            if(!disc.updated && disc.active) {
                disc.update(peers);
            }
        });
    
        poissons.map((disc) => {
            if(disc.updated) {
                disc.apply();
            }
        })

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        poissons.map((disc) => {
            ctx.beginPath();
            ctx.arc(disc.x, disc.y, 1, 0, 2*Math.PI);
            ctx.arc(disc.x, disc.y, disc.radius, 0, 2*Math.PI);
            ctx.stroke();
        });
    }
}
else {
    while(!checkCoveredArea(canvas, poissons, 0.5) || checkActivePoissons(poissons)) {
        poissons.map((disc, i) => {
            let peers = [...poissons]
            peers.splice(i,1);
            if(!disc.updated && disc.active) {
                disc.update(peers);
            }
        });
    
        poissons.map((disc) => {
            if(disc.updated) {
                disc.apply();
            }
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        poissons.map((disc) => {
            ctx.beginPath();
            ctx.arc(disc.x, disc.y, 1, 0, 2*Math.PI);
            ctx.arc(disc.x, disc.y, disc.radius, 0, 2*Math.PI);
            ctx.stroke();
        });
    
        if(step === stepDelay && !checkCoveredArea(canvas, poissons, 0.5)) {
            let point = findSafePoint(poissons, points);
            poissons.push(new Psudopoisson(point.x, point.y, 0, startingRadius, radiusStep));
            step = 0;
        }
        else if(poissons.length === 0) {
            poissons.push(new Psudopoisson(RNG(0, canvas.width), RNG(0, canvas.height), 0, startingRadius, radiusStep));
        }

        step++
    }

    let averageDiscSize = 0
    let candidates = [];
    poissons.map((poisson) => {
        averageDiscSize += poisson.radius;
    });
    averageDiscSize = averageDiscSize / poissons.length;

    poissons.map((poisson) => {
        if(poisson.radius >= averageDiscSize / 2) {
            candidates.push(poisson);
        }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    candidates.map((disc) => {
        ctx.beginPath();
        ctx.arc(disc.x, disc.y, 1, 0, 2*Math.PI);
        ctx.arc(disc.x, disc.y, disc.radius, 0, 2*Math.PI);
        ctx.stroke();
    });

    let largestDiscSize = 0;
    let smallestDiscSize = 0;

    let repeats = []
    candidates.map((poisson) => {
        if(poisson.radius > largestDiscSize) {
            largestDiscSize = poisson.radius;
        }

        if(smallestDiscSize === 0 || poisson.radius < smallestDiscSize) {
            smallestDiscSize = poisson.radius;
        }
    });

    candidates.map((poisson) => {
        if(poisson.y < largestDiscSize && poisson.x < largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x + canvas.width, poisson.y + canvas.height, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
        else if(poisson.y < largestDiscSize && poisson.x > canvas.width - largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x - canvas.width, poisson.y + canvas.height, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
        else if(poisson.y > canvas.height - largestDiscSize && poisson.x < largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x + canvas.width, poisson.y - canvas.height, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
        else if(poisson.y > canvas.height - largestDiscSize && poisson.x > canvas.width - largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x - canvas.width, poisson.y - canvas.height, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
        else if(poisson.y < largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x, poisson.y + canvas.height, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
        else if (poisson.y > canvas.height - largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x, poisson.y - canvas.height, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
        else if(poisson.x < largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x + canvas.width, poisson.y, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
        else if(poisson.x > canvas.width - largestDiscSize) {
            let repeatPoisson = new Psudopoisson(poisson.x - canvas.width, poisson.y, 0, poisson.radius, 0);
            repeats.push(repeatPoisson);
        }
    });

    candidates.push(...repeats);
    
    let imageData = ctx.createImageData(canvas.width, canvas.height);

    for(let i = 0; i < imageData.data.length; i += 4) {
        let y = (i / 4) / canvas.width;
        let x = (i / 4) % canvas.width;

        let closestCandidate = null;
        candidates.map((candidate) => {
            let myDistance = Math.sqrt((x - candidate.x)**2 + (y - candidate.y)**2);
            if(closestCandidate !== null) {
                let compDistance = Math.sqrt((x - closestCandidate.x)**2 + (y - closestCandidate.y)**2);
                if(myDistance < compDistance) closestCandidate = candidate;
            }
            else closestCandidate = candidate;
        });

        let candidateDistance = Math.sqrt((x - closestCandidate.x)**2 + (y - closestCandidate.y)**2);

        let distancePercent;

        if(candidateDistance < largestDiscSize) {
            distancePercent = (largestDiscSize - candidateDistance) / largestDiscSize
        }
        else{
            distancePercent = 0
        }

        imageData.data[i + 0] = distancePercent * 255;
        imageData.data[i + 1] = distancePercent * 255;
        imageData.data[i + 2] = distancePercent * 255;
        imageData.data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

}

function checkCoveredArea(canvas, poissons, threshold) {
    let canvasArea = canvas.width * canvas.height;
    let totalPoissonArea = 0;

    poissons.map((poisson) => {
        let poissonArea = Math.PI * poisson.radius**2;
        totalPoissonArea += poissonArea;
    });

    if(totalPoissonArea / canvasArea >= threshold) return true;
    else return false;
}

function checkActivePoissons(ar) {
    let flag = false
    ar.map((poisson) => {
        if(poisson.active) {
            flag = true;
        }
    });
    return flag;
}

function findSafePoint(discs, points) {
    let contender = points[RNG(0, points.length - 1)][RNG(0, points[0].length - 1)];
    let flag = true;

    discs.map((disc) => {
        let distance = Math.abs(Math.sqrt((disc.x - contender.x)**2 + (disc.y - contender.y)**2));
        if(distance <= disc.radius + radiusStep + startingRadius) {
            flag = false;
        }
    });

    if(flag) return {
        x: contender.x,
        y: contender.y
    };
    else return findSafePoint(discs, points);
}

function RNG(min, max) {
    max = Math.ceil(max);
    min = Math.floor(min);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}