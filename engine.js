// 캔버스와 컨텍스트 가져오기
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 물리 객체 클래스 정의
class Polygon {

    // 항상 0,0 이 무게중심이 되도록 설정해야함
    constructor(vertices, position, velocity, color, mass) {
        this.vertices = vertices;                           // 꼭짓점 정보를 담고 있는 배열
        this.position = position;                           // 다각형의 위치 (x, y, r 좌표)
        this.velocity = velocity;                           // 운동량 (x, y, r 방향의 속도)
        this.color = color;                                 // 다각형의 색상
        this.mass = mass;                                   // 무게
    }

    getRotatedVertices() {
        const rotatedVertices = [];

        for (const v of this.vertices) {
            const rotatedX = v.x * Math.cos(this.position.r) - v.y * Math.sin(this.position.r);
            const rotatedY = v.x * Math.sin(this.position.r) + v.y * Math.cos(this.position.r);
            rotatedVertices.push({ x: rotatedX, y: rotatedY });
        }

        return rotatedVertices;
    }

    draw() {
        const rotatedVertices = this.getRotatedVertices();

        ctx.beginPath();
        ctx.moveTo(rotatedVertices[0].x + this.position.x, rotatedVertices[0].y + this.position.y);

        for (let i = 1; i < rotatedVertices.length; i++) {
            const vertex = rotatedVertices[i];
            ctx.lineTo(vertex.x + this.position.x, vertex.y + this.position.y);
        }

        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.r += this.velocity.r;

        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.y > canvas.height) this.position.y = 0;
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.y < 0) this.position.y = canvas.height;
    }
}

function checkPolygonCollision(polygonA, polygonB) {

}

function findIntersection(p1, p2, p3, p4) {
    const crossProduct = (v1, v2) => v1[0] * v2[1] - v1[1] * v2[0];
    const subtract = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];
    const isBetween = (p, p1, p2) => {
        Math.min(p1[0], p2[0]) <= p[0] && p[0] <= Math.max(p1[0], p2[0]) &&
        Math.min(p1[1], p2[1]) <= p[1] && p[1] <= Math.max(p1[1], p2[1]);
    }
    let d1 = subtract(p2, p1), d2 = subtract(p4, p3), p3_p1 = subtract(p3, p1);
    let t = crossProduct(d2, p3_p1) / crossProduct(d1, d2);
    let intersection = [p1[0] + t * d1[0], p1[1] + t * d1[1]];

    return isBetween(intersection, p1, p2) && isBetween(intersection, p3, p4) ? intersection : null;
}

// 물리 객체 배열 생성
const objects = [];

for (let i = 0; i < 5; i++) {
    const vertices = [
        { x: -20, y: -20 },
        { x: 20, y: -20 },
        { x: 20, y: 20 },
        { x: -20, y: 20 },
    ]
    const position = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 6.28319,
    }
    const velocity = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        r: Math.random() * 0.2 - 0.1,
    };
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    const mass = 1;

    objects.push(new Polygon(vertices, position, velocity, color, mass));
}

// 애니메이션 프레임 루프
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const object of objects) {
        object.update();
        object.draw();
    }

    requestAnimationFrame(animate);
}

// global.requestAnimationFrame = callback => {
//     setTimeout(callback, 1000 / 60);
// };
// // 이제 requestAnimationFrame을 사용할 수 있습니다.
// requestAnimationFrame(() => {
//     console.log('Hello, world!');
// });

animate();