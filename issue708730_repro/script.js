let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl2', {
    antialias: false,
    depth: true,
    stencil: true,
    alpha: false
});

// create a global VAO
let vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// initial GL state
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.ALWAYS);
gl.depthMask(gl.FALSE);
gl.disable(gl.STENCIL_TEST);
gl.stencilFunc(gl.ALWAYS, 0, 0xFFFFFFFF);
gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
gl.stencilMask(0xFFFFFFFF);
gl.disable(gl.BLEND);
gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
gl.colorMask(true, true, true, true);
gl.blendColor(1.0, 1.0, 1.0, 1.0);
gl.disable(gl.CULL_FACE);
gl.frontFace(gl.CW);
gl.cullFace(gl.BACK);
gl.disable(gl.POLYGON_OFFSET_FILL);
gl.disable(gl.SCISSOR_TEST);
gl.enable(gl.DITHER);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// create render target texture, MSAA framebuffer, and resolve framebuffer
let t0 = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, t0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 128, 128, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
let rb0 = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, rb0);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.RGBA8, 128, 128);
let rb1 = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, rb1);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.DEPTH_COMPONENT16, 128, 128);
let fb0 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb0);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rb0);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb1);
gl.checkFramebufferStatus(gl.FRAMEBUFFER);
let fb1 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t0, 0);
gl.checkFramebufferStatus(gl.FRAMEBUFFER);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// cube vertices
let vb0 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vb0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.10, -0.10, -0.10,   1.0, 0.0, 0.0, 1.0, 
     0.10, -0.10, -0.10,   1.0, 0.0, 0.0, 1.0,
     0.10,  0.10, -0.10,   1.0, 0.0, 0.0, 1.0,
    -0.10,  0.10, -0.10,   1.0, 0.0, 0.0, 1.0,
    -0.10, -0.10,  0.10,   0.0, 1.0, 0.0, 1.0,      
     0.10, -0.10,  0.10,   0.0, 1.0, 0.0, 1.0, 
     0.10,  0.10,  0.10,   0.0, 1.0, 0.0, 1.0,
    -0.10,  0.10,  0.10,   0.0, 1.0, 0.0, 1.0,
    -0.10, -0.10, -0.10,   0.0, 0.0, 1.0, 1.0, 
    -0.10,  0.10, -0.10,   0.0, 0.0, 1.0, 1.0, 
    -0.10,  0.10,  0.10,   0.0, 0.0, 1.0, 1.0, 
    -0.10, -0.10,  0.10,   0.0, 0.0, 1.0, 1.0,
     0.10, -0.10, -0.10,   1.0, 1.0, 0.0, 1.0, 
     0.10,  0.10, -0.10,   1.0, 1.0, 0.0, 1.0, 
     0.10,  0.10,  0.10,   1.0, 1.0, 0.0, 1.0, 
     0.10, -0.10,  0.10,   1.0, 1.0, 0.0, 1.0,
    -0.10, -0.10, -0.10,   0.0, 1.0, 1.0, 1.0, 
    -0.10, -0.10,  0.10,   0.0, 1.0, 1.0, 1.0, 
     0.10, -0.10,  0.10,   0.0, 1.0, 1.0, 1.0, 
     0.10, -0.10, -0.10,   0.0, 1.0, 1.0, 1.0,
    -0.10,  0.10, -0.10,   1.0, 0.0, 1.0, 1.0, 
    -0.10,  0.10,  0.10,   1.0, 0.0, 1.0, 1.0, 
     0.10,  0.10,  0.10,   1.0, 0.0, 1.0, 1.0, 
     0.10,  0.10, -0.10,   1.0, 0.0, 1.0, 1.0      
]), gl.STATIC_DRAW);

// cube indices
let ib0 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib0);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
    0, 1, 2,  0, 2, 3,  
    4, 5, 6,  4, 6, 7,
    8, 9, 10,  8, 10, 11,  
    12, 13, 14,  12, 14, 15,
    16, 17, 18,  16, 18, 19,  
    20, 21, 22,  20, 22, 23 
]), gl.STATIC_DRAW);

// cube shaders
let vs0 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs0, `#version 300 es
uniform mat4 mvp;
in vec4 position;
in vec4 color;
out vec4 clr;
void main() {
    gl_Position = mvp * position;
    clr = color;
}
`);
gl.compileShader(vs0);
let err = gl.getShaderInfoLog(vs0);
if (err.length > 0) throw err;
let fs0 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs0, `#version 300 es
precision mediump float;
in vec4 clr;
layout (location = 0) out vec4 _color;
void main() {
    _color = clr;
}
`);
gl.compileShader(fs0);
err = gl.getShaderInfoLog(fs0);
if (err.length > 0) throw err;
let p0 = gl.createProgram();
gl.attachShader(p0, vs0);
gl.attachShader(p0, fs0);
gl.bindAttribLocation(p0, 0, "position");
gl.bindAttribLocation(p0, 1, "normal");
gl.bindAttribLocation(p0, 2, "texcoord0");
gl.bindAttribLocation(p0, 3, "texcoord1");
gl.bindAttribLocation(p0, 4, "texcoord2");
gl.bindAttribLocation(p0, 5, "texcoord3");
gl.bindAttribLocation(p0, 6, "tangent")
gl.bindAttribLocation(p0, 7, "binormal")
gl.bindAttribLocation(p0, 8, "weights")
gl.bindAttribLocation(p0, 9, "indices")
gl.bindAttribLocation(p0, 10, "color0")
gl.bindAttribLocation(p0, 11, "color1")
gl.bindAttribLocation(p0, 12, "instance0")
gl.bindAttribLocation(p0, 13, "instance1")
gl.bindAttribLocation(p0, 14, "instance2")
gl.bindAttribLocation(p0, 15, "instance3")
gl.linkProgram(p0);
gl.validateProgram(p0);
gl.useProgram(p0);
let mvpParam = gl.getUniformLocation(p0, "mvp");

// quad mesh (only vertices)
let vb1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vb1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.5, -0.5, 0.5,    0.0, 0.0,   // first triangle
    +0.5, -0.5, 0.5,    1.0, 0.0,
    +0.5, +0.5, 0.5,    1.0, 1.0,
    -0.5, -0.5, 0.5,    0.0, 0.0,   // second triangle
    +0.5, +0.5, 0.5,    1.0, 1.0,
    -0.5, +0.5, 0.5,    0.0, 1.0,    
]), gl.STATIC_DRAW);

// quad shader
let vs1 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs1, `#version 300 es
in vec4 position;
in vec2 texcoord0;
out vec2 uv;
void main() {
    gl_Position = position;
    uv = texcoord0;
}
`);
gl.compileShader(vs1);
err = gl.getShaderInfoLog(vs1);
if (err.length > 0) throw err;
let fs1 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs1, `#version 300 es
precision mediump float;
uniform sampler2D tex;
in vec2 uv;
layout (location = 0) out vec4 _color;
void main() {
    _color = texture(tex, uv);
}
`);
gl.compileShader(fs1);
err = gl.getShaderInfoLog(fs1);
if (err.length > 0) throw err;
let p1 = gl.createProgram();
gl.attachShader(p1, vs1);
gl.attachShader(p1, fs1);
gl.bindAttribLocation(p1, 0, "position");
gl.bindAttribLocation(p1, 1, "normal");
gl.bindAttribLocation(p1, 2, "texcoord0");
gl.bindAttribLocation(p1, 3, "texcoord1");
gl.bindAttribLocation(p1, 4, "texcoord2");
gl.bindAttribLocation(p1, 5, "texcoord3");
gl.bindAttribLocation(p1, 6, "tangent")
gl.bindAttribLocation(p1, 7, "binormal")
gl.bindAttribLocation(p1, 8, "weights")
gl.bindAttribLocation(p1, 9, "indices")
gl.bindAttribLocation(p1, 10, "color0")
gl.bindAttribLocation(p1, 11, "color1")
gl.bindAttribLocation(p1, 12, "instance0")
gl.bindAttribLocation(p1, 13, "instance1")
gl.bindAttribLocation(p1, 14, "instance2")
gl.bindAttribLocation(p1, 15, "instance3")
gl.linkProgram(p1);
gl.deleteShader(vs1);
gl.deleteShader(fs1);
gl.useProgram(p1);
let texParam = gl.getUniformLocation(p1, "tex");
gl.uniform1i(texParam, 0);

function draw() {

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb0);
    gl.drawBuffers([ gl.COLOR_ATTACHMENT0 ]);
    gl.viewport(0, 0, 128, 128);
    gl.depthMask(gl.TRUE);
    // an 'oversized' Float32Array with the actual clear
    // color (0.25, 0.25, 0.25, 1.0) in the middle
    let fp32 = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        0.25, 0.25, 0.25, 1.0,
        0.0, 1.0, 0.0, 1.0
    ]);
    // call clearBufferfv with the Float32Array and and offset
    // to find the clear color (this seems to be broken in Chrome)
    gl.clearBufferfv(gl.COLOR, 0, fp32, 4);
    gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1.0, 0);
    
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(p0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 28, 12);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.disableVertexAttribArray(2);
    gl.uniformMatrix4fv(mvpParam, gl.FALSE, [
        2.414093, 0.0004828024, 0.01000784, 0.009997834, 
        0, 2.413731, -0.02001867, -0.01999867, 
        0.02414173, -0.04827863, -1.00075, -0.99975, 
        0, 0, 2.982992, 3
    ]);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fb0);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb1);
    gl.readBuffer(gl.COLOR_ATTACHMENT0);
    gl.drawBuffers([ gl.COLOR_ATTACHMENT0 ]);
    gl.blitFramebuffer(0, 0, 128, 128, 0, 0, 128, 128, gl.COLOR_BUFFER_BIT, gl.NEAREST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, 640, 480);
    gl.clearColor(0.25, 0.45, 0.65, 1.0);
    gl.clearDepth(1.0);
    gl.clearStencil(0);
    gl.clear(gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT|gl.COLOR_BUFFER_BIT);
    gl.useProgram(p1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb1);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 20, 0);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 20, 12);
    gl.enableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(draw);
}
draw();
