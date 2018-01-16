function resize() {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
}
resize();
window.onresize = resize;

var rx = 0,
    ry = 180,
    rz = 180,
    clicked = {};
can.onmousemove = function (e) {
    if (clicked.down) {
        var left = clicked.coord[0] - e.clientX;
        var top = clicked.coord[1] - e.clientY;
        clicked.coord[0] = e.clientX;
        clicked.coord[1] = e.clientY;
        rz += left / 5;
        ry += top / 5;
    }
}
can.ontouchmove = function (e) {
    if (clicked.down) {
        var left = clicked.coord[0] - e.touches[0].clientX;
        var top = clicked.coord[1] - e.touches[0].clientY;
        clicked.coord[0] = e.touches[0].clientX;
        clicked.coord[1] = e.touches[0].clientY;
        rz += left / 5;
        ry += top / 5;
    }
}
can.ontouchstart = function (e) {
    clicked.down = true;
    clicked.coord = [e.touches[0].clientX, e.touches[0].clientY];
}
can.ontouchend = function () {
    clicked.down = false;
}
can.onmousedown = function (e) {
    clicked.down = true;
    clicked.coord = [e.clientX, e.clientY];
}
can.onmouseup = function () {
    clicked.down = false;
}


var gl = can.getContext("webgl") || can.getContext("experimental-webgl");
var g = new Helper(gl);

var vertexShader = `
    precision mediump float;
    attribute vec3 pos;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 proj;

    varying vec3 col;
    void main(){
        col = vec3(0.1,0.1,0.1);
        //col = 0.5*pos+vec3(0.5,0.5,0.5);
        gl_Position = proj * view * model * vec4(pos,1.0);
    }
`;
var fragmentShader = `
    precision mediump float;
    varying vec3 col;
    void main(){
            gl_FragColor = vec4(col,1.0);
    }
`;
g.setVertexShader(vertexShader);
g.setFragmentShader(fragmentShader);
g.bind();
gl.enable(gl.DEPTH_TEST);

// var triangles = [
// 0.0, 1.0, 0.0, -1.0, -1.0, 0.0,
// 1.0, -1.0, 0.0
// ];
var triangles = [];

function dist(z, o) {
    return Math.sqrt(Math.pow(z.x - o.x, 2) + Math.pow(z.y - o.y, 2) + Math.pow(z.z - o.z, 2));
}

function ang(z, o) {
    var a = vec3.fromValues(z.x, z.y, z.z);
    var b = vec3.fromValues(o.x, o.y, o.z);
    return vec3.angle(a, b);
}

function ang2d(z, o) {
    return Math.atan2(z.y - o.y, z.x - o.x);
}

function sierpinski(coords, limit) {
    if (--limit) {
        var x12 = (coords[0].x + coords[1].x) / 2;
        var y12 = (coords[0].y + coords[1].y) / 2;
        var z12 = (coords[0].z + coords[1].z) / 2;

        var x13 = (coords[0].x + coords[2].x) / 2;
        var y13 = (coords[0].y + coords[2].y) / 2;
        var z13 = (coords[0].z + coords[2].z) / 2;


        var x14 = (coords[0].x + coords[3].x) / 2;
        var y14 = (coords[0].y + coords[3].y) / 2;
        var z14 = (coords[0].z + coords[3].z) / 2;

        var x15 = (coords[0].x + coords[4].x) / 2;
        var y15 = (coords[0].y + coords[4].y) / 2;
        var z15 = (coords[0].z + coords[4].z) / 2;



        var x23 = (coords[1].x + coords[2].x) / 2;
        var y23 = (coords[1].y + coords[2].y) / 2;
        var z23 = (coords[1].z + coords[2].z) / 2;

        var x25 = (coords[1].x + coords[4].x) / 2;
        var y25 = (coords[1].y + coords[4].y) / 2;
        var z25 = (coords[1].z + coords[4].z) / 2;

        var x34 = (coords[2].x + coords[3].x) / 2;
        var y34 = (coords[2].y + coords[3].y) / 2;
        var z34 = (coords[2].z + coords[3].z) / 2;

        var x45 = (coords[3].x + coords[4].x) / 2;
        var y45 = (coords[3].y + coords[4].y) / 2;
        var z45 = (coords[3].z + coords[4].z) / 2;

        sierpinski([
            coords[0],
            {
                x: x12,
                y: y12,
                z: z12
            }, {
                x: x13,
                y: y13,
                z: z13
            }, {
                x: x14,
                y: y14,
                z: z14
            }, {
                x: x15,
                y: y15,
                z: z15
            }
        ], limit);
        var base_mid_x = (x25 + x34) / 2;
        var base_mid_y = (y25 + y34) / 2;
        var base_mid_z = (z25 + z34) / 2;
        sierpinski([{
            x: x12,
            y: y12,
            z: z12
        }, coords[1], {
            x: x23,
            y: y23,
            z: z23
        }, {
            x: base_mid_x,
            y: base_mid_y,
            z: base_mid_z
        }, {
            x: x25,
            y: y25,
            z: z25
        }], limit);
        sierpinski([{
            x: x13,
            y: y13,
            z: z13
        }, {
            x: x23,
            y: y23,
            z: z23
        }, coords[2], {
            x: x34,
            y: y34,
            z: z34
        }, {
            x: base_mid_x,
            y: base_mid_y,
            z: base_mid_z
        }], limit);
        sierpinski([{
            x: x14,
            y: y14,
            z: z14
        }, {
            x: base_mid_x,
            y: base_mid_y,
            z: base_mid_z
        }, {
            x: x34,
            y: y34,
            z: z34
        }, coords[3], {
            x: x45,
            y: y45,
            z: z45
        }], limit);

        sierpinski([{
            x: x15,
            y: y15,
            z: z15
        }, {
            x: x25,
            y: y25,
            z: z25
        }, {
            x: base_mid_x,
            y: base_mid_y,
            z: base_mid_z
        }, {
            x: x45,
            y: y45,
            z: z45
        }, coords[4]], limit);
    } else {
        triangles.push(
            coords[0].x, coords[0].y, coords[0].z,
            coords[1].x, coords[1].y, coords[1].z,
            coords[2].x, coords[2].y, coords[2].z,
            coords[0].x, coords[0].y, coords[0].z,
            coords[2].x, coords[2].y, coords[2].z,
            coords[3].x, coords[3].y, coords[3].z,
            coords[0].x, coords[0].y, coords[0].z,
            coords[3].x, coords[3].y, coords[3].z,
            coords[4].x, coords[4].y, coords[4].z,
            coords[0].x, coords[0].y, coords[0].z,
            coords[4].x, coords[4].y, coords[4].z,
            coords[1].x, coords[1].y, coords[1].z,
        );
    }
}
// 0.0, 1.0, 0.0, -1.0, -1.0, 0.0,
// 1.0, -1.0, 0.0

var proj = g.getUniform("proj");
var view = g.getUniform("view");
var v = new Float32Array(16);
var p = new Float32Array(16);
mat4.lookAt(v, [0, 0, -5], [0, 0, 3.0], [0, 1, 0]);
mat4.perspective(p, 0.5, can.width / can.height, 0.1, 10000);

g.setUniform(view, v);
g.setUniform(proj, p);

triangles = [];
sierpinski([{
    x: 0.0,
    y: 1.0,
    z: 0.0
}, {
    x: -1.0,
    y: -1.0,
    z: -1.0
}, {
    x: 1.0,
    y: -1.0,
    z: -1.0
}, {
    x: 1.0,
    y: -1.0,
    z: 1.0
}, {
    x: -1.0,
    y: -1.0,
    z: 1.0
}], 7);

function draw() {
    var yrot = new Float32Array(16);
    var zrot = new Float32Array(16);
    var m = new Float32Array(16);
    mat4.identity(yrot);
    mat4.identity(zrot);
    mat4.fromRotation(yrot, glMatrix.toRadian(ry), [1, 0, 0]);
    mat4.fromRotation(zrot, glMatrix.toRadian(rz), [0, 0, 1]);
    mat4.mul(m, yrot, zrot);
    var model = g.getUniform("model");
    g.setUniform(model, m);
    g.createBuffer(gl.ARRAY_BUFFER, triangles, gl.STATIC_DRAW);
    var pos = g.getAttrib("pos");
    g.setAttrib(pos, {
        size: 3,
        totalSize: 3 * Float32Array.BYTES_PER_ELEMENT,
        offsetSize: 0
    });
    g.enableAttrib(pos);

    var model = g.getUniform("model");


    // mat4.identity(m);
    // mat4.fromRotation(m, performance.now() / 1000 / 6 * (Math.PI * 2), [0, 1, 0]);
    // mat4.fromRotation(m, 0, [0, 1, 0]);
    // mat4.identity(v);

    g.setUniform(model, m);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, triangles.length / 3);
    requestAnimationFrame(draw);
}
draw();