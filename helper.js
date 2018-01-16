class Helper {
    constructor(gl) {
        this.gl = gl;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.program = null;
        this.currentBuffer = {};
    }
    createShader(type, source) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log("failed to initialise shader : ", " ", this.gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    setVertexShader(source) {
        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, source);
        return this.vertexShader;
    }
    setFragmentShader(source) {
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, source);
        return this.fragmentShader;
    }
    bind() {
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.log("linker failed", " ", this.gl.getProgramInfoLog(this.program));
        }
        this.gl.useProgram(this.program);
        return this.program;
    }
    createBuffer(type, array, drawType) {
        var buf = this.gl.createBuffer();
        this.gl.bindBuffer(type, buf);
        this.gl.bufferData(type, new Float32Array(array), drawType);
        this.currentBuffer.object = buf;
        this.currentBuffer.type = type;
        return this.currentBuffer;
    }
    getAttrib(attrib) {
        var attr = this.gl.getAttribLocation(this.program, attrib);
        return attr;
    }
    setAttrib(attr, value, buf) {
        if (buf && buf.object != this.currentBuffer.object) {
            this.gl.bindBuffer(buf.type, buf.object);
        }
        buf && this.gl.bindBuffer(buf.type, buf.object);
        this.gl.vertexAttribPointer(
            attr,
            value.size,
            this.gl.FLOAT,
            this.gl.FALSE,
            value.totalSize,
            value.offsetSize
        );
    }
    enableAttrib(attrib) {
        this.gl.enableVertexAttribArray(attrib);
    }
    getUniform(name) {
        var unif = this.gl.getUniformLocation(this.program, name);
        return unif;
    }
    setUniform(unif, value) {
        this.gl.uniformMatrix4fv(unif, this.gl.false, value);
    }
    setUniformVec(unif, value) {
        this.gl.uniform2f(unif, ...value);
    }
    draw(func) {
        func();
    }
}