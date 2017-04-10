//
//  reproduction test case for https://bugs.chromium.org/p/chromium/issues/detail?id=696187
//
//  this also gives the following warning:
//  [.Offscreen-For-WebGL-0x7fd6ac046200]GL ERROR :GL_INVALID_FRAMEBUFFER_OPERATION : glBlitFramebufferCHROMIUM: framebuffer incomplete (check)
//
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

// create a 3 MSAA 'offscreen render targets', each consisting of:
//  - 1 color texture which will hold the MSAA resolve result
//  - 1 MSAA color renderbuffer
// plus one depth-stencil renderbuffer
let tex0 = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 200, 200, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
let c_rb0 = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, c_rb0);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.RGBA8, 200, 200);
let ds_rb = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, ds_rb);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.DEPTH24_STENCIL8, 200, 200);

// 2nd offscreen render target
let tex1 = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex1);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 200, 200, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
let c_rb1 = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, c_rb1);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.RGBA8, 200, 200);

// 3rd offscreen render target
let tex2 = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex2);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 200, 200, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
let c_rb2 = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, c_rb2);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.RGBA8, 200, 200);

// an MRT framebuffer with the 3 MSAA renderbuffers and MSAA depth/stencil attachments 
let mrt_fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, mrt_fb);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, c_rb0);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.RENDERBUFFER, c_rb1);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.RENDERBUFFER, c_rb2);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ds_rb);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, ds_rb);
gl.checkFramebufferStatus(gl.FRAMEBUFFER);

// 3 'MSAA resolve framebuffers' which are the target for the MSAA-resolve-blit,
// with the 3 color textures as color attachments
let res_fb0 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, res_fb0);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex0, 0);
gl.checkFramebufferStatus(gl.FRAMEBUFFER);
let res_fb1 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, res_fb1);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, tex1, 0);
gl.checkFramebufferStatus(gl.FRAMEBUFFER);
let res_fb2 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, res_fb2);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, tex2, 0);

function draw() {
    // draw one frame
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, 1024, 768);

//--- BEGIN: comment out the block begin BEGIN/END to make the demo run
    // clear the 3 MSAA offscreen color renderbuffers and depth/stencil renderbuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, mrt_fb);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
    gl.viewport(0, 0, 200, 200);
    gl.depthMask(true);
    gl.clearBufferfv(gl.COLOR, 0, [0.25,0.0,0.0,1.0]);
    gl.clearBufferfv(gl.COLOR, 1, [0.0,0.25,0.0,1.0]);
    gl.clearBufferfv(gl.COLOR, 2, [0.0,0.0,0.25,1.0]);
    gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1.0, 0);

    // the MSAA resolve operation
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, mrt_fb);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, res_fb0);
    gl.readBuffer(gl.COLOR_ATTACHMENT0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    gl.blitFramebuffer(0, 0, 200, 200, 0, 0, 200, 200, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, res_fb1);
    gl.readBuffer(gl.COLOR_ATTACHMENT1);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    gl.blitFramebuffer(0, 0, 200, 200, 0, 0, 200, 200, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, res_fb2);
    gl.readBuffer(gl.COLOR_ATTACHMENT2);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    gl.blitFramebuffer(0, 0, 200, 200, 0, 0, 200, 200, gl.COLOR_BUFFER_BIT, gl.NEAREST);
//--- END

    // bind and clear the default framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, 1024, 768);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clearDepth(1.0);
    gl.clearStencil(0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.STENCIL_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    requestAnimationFrame(draw);
}
draw();
requestAnimationFrame(draw);
