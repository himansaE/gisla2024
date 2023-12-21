type ParamType = {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE_ITERATIONS: number;
  SPLAT_RADIUS: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
};

export function createShader(
  gl: WebGLRenderingContext,
  sourceCode: string,
  type: number
) {
  const shader = gl.createShader(type);
  if (!shader) return;
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
export function createProgram(
  gl: WebGLRenderingContext,
  script: string,
  vertexShader: WebGLShader
) {
  const shader = createShader(gl, script, gl.FRAGMENT_SHADER);
  if (!shader) return;
  const program = createShaderProgram(gl, vertexShader, shader);
  if (!program) return;
  const uniforms = getUniforms(gl, program);
  return {
    program,
    uniforms,
  };
}

export function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
    );
    return null;
  }
  return program;
}

export function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
  let uniforms: Record<string, WebGLUniformLocation> = {};
  let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
    let uniformName = gl.getActiveUniform(program, i)?.name;
    if (!uniformName) continue;
    const loc = gl.getUniformLocation(program, uniformName);
    if (!loc) continue;
    uniforms[uniformName] = loc;
  }
  return uniforms;
}

export function blit(
  gl: WebGLRenderingContext,
  target: ReturnType<typeof createFBO> | null
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  if (target == null) {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  } else {
    gl.viewport(0, 0, target.width, target.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
  }
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

// no side-effect just return values
export function initFBOs(gl: WebGLRenderingContext, params: ParamType) {
  const simRes = getResolution(gl, params.SIM_RESOLUTION);
  const dyeRes = getResolution(gl, params.DYE_RESOLUTION);

  return {
    outputColor: createDoubleFBO(gl, dyeRes.width, dyeRes.height, gl.RGBA),
    velocity: createDoubleFBO(gl, simRes.width, simRes.height, gl.RGBA),
    divergence: createFBO(gl, simRes.width, simRes.height, gl.RGBA),
    pressure: createDoubleFBO(gl, simRes.width, simRes.height, gl.RGBA),
  };
}

export function getResolution(gl: WebGLRenderingContext, resolution: number) {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;

  let min = Math.round(resolution);
  let max = Math.round(resolution * aspectRatio);

  if (gl.drawingBufferWidth > gl.drawingBufferHeight)
    return { width: max, height: min };
  else return { width: min, height: max };
}

export function createFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  type: number
) {
  gl.activeTexture(gl.TEXTURE0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, type, w, h, 0, type, gl.FLOAT, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    fbo,
    width: w,
    height: h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    },
  };
}
export function createDoubleFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  type: number
) {
  let fbo1 = createFBO(gl, w, h, type);
  let fbo2 = createFBO(gl, w, h, type);

  return {
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    read: () => {
      return fbo1;
    },
    write: () => {
      return fbo2;
    },
    swap() {
      let temp = fbo1;
      fbo1 = fbo2;
      fbo2 = temp;
    },
  };
}
