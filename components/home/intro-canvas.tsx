"use client";

import {
  fragShaderAdvection,
  fragShaderDisplay,
  fragShaderDivergence,
  fragShaderGradientSubtract,
  fragShaderPoint,
  fragShaderPressure,
  vertShader,
} from "@/lib/webgl/shader";
import { blit, createProgram, createShader, initFBOs } from "@/lib/webgl/utils";
import { useEffect, useRef } from "react";

export const IntroCanvas = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const animation_frame = useRef<number>(-1);
  const params = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 0.995,
    VELOCITY_DISSIPATION: 0.9,
    PRESSURE_ITERATIONS: 10,
    SPLAT_RADIUS: 3 / 600,
    color: { r: 0.6, g: 0.2078431373, b: 0.4862745098 },
  };
  const pointer = {
    x: 0.65 * 1200,
    y: 0.5 * 600,
    dx: 0,
    dy: 0,
    moved: false,
    firstMove: false,
  };

  useEffect(() => {
    if (!canvas.current) return;

    const gl = canvas.current.getContext("webgl");
    if (!gl) return;
    // innit
    const timeout = window.setTimeout(() => {
      pointer.firstMove = true;
    }, 3000);

    let prevTimestamp = Date.now();
    gl.getExtension("OES_texture_float");
    const { outputColor, velocity, divergence, pressure } = initFBOs(
      gl,
      params
    );

    //#region "webgl"

    const vertexShader = createShader(gl, vertShader, gl.VERTEX_SHADER);
    if (!vertexShader) return;
    const splatProgram = createProgram(gl, fragShaderPoint, vertexShader);
    const divergenceProgram = createProgram(
      gl,
      fragShaderDivergence,
      vertexShader
    );
    const pressureProgram = createProgram(gl, fragShaderPressure, vertexShader);
    const gradientSubtractProgram = createProgram(
      gl,
      fragShaderGradientSubtract,
      vertexShader
    );
    const advectionProgram = createProgram(
      gl,
      fragShaderAdvection,
      vertexShader
    );
    const displayProgram = createProgram(gl, fragShaderDisplay, vertexShader);
    const onResize = () => {
      if (!canvas.current) return;
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;
      params.SPLAT_RADIUS = 3 / window.innerHeight;
    };
    onResize();
    window.addEventListener("resize", onResize);

    function render() {
      if (!canvas.current) return;
      if (!splatProgram) return;
      if (!divergenceProgram) return;
      if (!pressureProgram) return;
      if (!gradientSubtractProgram) return;
      if (!advectionProgram) return;
      if (!displayProgram) return;
      if (!gl) return;



      const dt = (Date.now() - prevTimestamp) / 1000;
      prevTimestamp = Date.now();

      if (!pointer.firstMove) {
        pointer.moved = true;
        const newX =
          (0.65 +
            0.2 *
            Math.cos(0.006 * prevTimestamp) *
            Math.sin(0.008 * prevTimestamp)) *
          window.innerWidth;
        const newY =
          (0.5 + 0.12 * Math.sin(0.01 * prevTimestamp)) * window.innerHeight;
        pointer.dx = 10 * (newX - pointer.x);
        pointer.dy = 10 * (newY - pointer.y);
        pointer.x = newX;
        pointer.y = newY;
      }

      if (pointer.moved) {
        pointer.moved = false;

        gl.useProgram(splatProgram.program);
        gl.uniform1i(
          splatProgram.uniforms.u_input_txr,
          velocity.read().attach(0)
        );
        gl.uniform1f(
          splatProgram.uniforms.u_ratio,
          canvas.current.width / canvas.current.height
        );
        gl.uniform2f(
          splatProgram.uniforms.u_point,
          pointer.x / canvas.current.width,
          1 - pointer.y / canvas.current.height
        );
        gl.uniform3f(
          splatProgram.uniforms.u_point_value,
          pointer.dx,
          -pointer.dy,
          1
        );
        gl.uniform1f(splatProgram.uniforms.u_point_size, params.SPLAT_RADIUS);

        blit(gl, velocity.write());
        velocity.swap();

        gl.uniform1i(
          splatProgram.uniforms.u_input_txr,
          outputColor.read().attach(0)
        );
        gl.uniform3f(
          splatProgram.uniforms.u_point_value,
          1 - params.color.r,
          1 - params.color.g,
          1 - params.color.b
        );
        blit(gl, outputColor.write());
        outputColor.swap();
      }

      gl.useProgram(divergenceProgram.program);
      gl.uniform2f(
        divergenceProgram.uniforms.u_vertex_texel,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        divergenceProgram.uniforms.u_velocity_txr,
        velocity.read().attach(0)
      );
      blit(gl, divergence);

      gl.useProgram(pressureProgram.program);
      gl.uniform2f(
        pressureProgram.uniforms.u_vertex_texel,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        pressureProgram.uniforms.u_divergence_txr,
        divergence.attach(0)
      );
      for (let i = 0; i < params.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(
          pressureProgram.uniforms.u_pressure_txr,
          pressure.read().attach(1)
        );
        blit(gl, pressure.write());
        pressure.swap();
      }

      gl.useProgram(gradientSubtractProgram.program);
      gl.uniform2f(
        gradientSubtractProgram.uniforms.u_vertex_texel,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        gradientSubtractProgram.uniforms.u_pressure_txr,
        pressure.read().attach(0)
      );
      gl.uniform1i(
        gradientSubtractProgram.uniforms.u_velocity_txr,
        velocity.read().attach(1)
      );
      blit(gl, velocity.write());
      velocity.swap();

      gl.useProgram(advectionProgram.program);
      gl.uniform2f(
        advectionProgram.uniforms.u_vertex_texel,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform2f(
        advectionProgram.uniforms.u_output_textel,
        velocity.texelSizeX,
        velocity.texelSizeY
      );

      gl.uniform1i(
        advectionProgram.uniforms.u_velocity_txr,
        velocity.read().attach(0)
      );
      gl.uniform1i(
        advectionProgram.uniforms.u_input_txr,
        velocity.read().attach(0)
      );
      gl.uniform1f(advectionProgram.uniforms.u_dt, dt);
      gl.uniform1f(
        advectionProgram.uniforms.u_dissipation,
        params.VELOCITY_DISSIPATION
      );
      blit(gl, velocity.write());
      velocity.swap();

      gl.uniform2f(
        advectionProgram.uniforms.u_output_textel,
        outputColor.texelSizeX,
        outputColor.texelSizeY
      );
      gl.uniform1i(
        advectionProgram.uniforms.u_velocity_txr,
        velocity.read().attach(0)
      );
      gl.uniform1i(
        advectionProgram.uniforms.u_input_txr,
        outputColor.read().attach(1)
      );
      gl.uniform1f(
        advectionProgram.uniforms.u_dissipation,
        params.DENSITY_DISSIPATION
      );
      blit(gl, outputColor.write());
      outputColor.swap();

      gl.useProgram(displayProgram.program);
      gl.uniform1i(
        displayProgram.uniforms.u_output_texture,
        outputColor.read().attach(0)
      );
      blit(gl, null);
      //#endregion 

      animation_frame.current = requestAnimationFrame(render);



      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER) // Check for framebuffer completeness

      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.warn('Framebuffer incomplete:', status);
        cancelAnimationFrame(animation_frame.current); // Stop the animation frame
      }
    }
    canvas.current.style.opacity = "1"

    render();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animation_frame.current);
    };
  }, []);

  return (
    <>
      <canvas
        id="intro-canvas"
        ref={canvas}
        width={1024}
        height={768}
        className="absolute top-0 left-0 w-full h-full min-h-[500px] z-[-10] bg-[#f7f5ff] opacity-0"
        onClick={(e) => {
          pointer.dx = 10;
          pointer.dy = 10;
          pointer.x = e.pageX;
          pointer.y = e.pageY;
          pointer.firstMove = true;
        }}
        onMouseMove={(e) => {
          pointer.moved = true;
          pointer.dx = 5 * (e.pageX - pointer.x);
          pointer.dy = 5 * (e.pageY - pointer.y);
          pointer.x = e.pageX;
          pointer.y = e.pageY;
          pointer.firstMove = true;
        }}
        onTouchMove={(e) => {
          pointer.moved = true;
          pointer.dx = 8 * (e.targetTouches[0].pageX - pointer.x);
          pointer.dy = 8 * (e.targetTouches[0].pageY - pointer.y);
          pointer.x = e.targetTouches[0].pageX;
          pointer.y = e.targetTouches[0].pageY;
          pointer.firstMove = true;
        }}

      ></canvas>
      <div className="absolute top-0 left-0 w-full  h-full z-[-5] bg-white mix-blend-exclusion"></div>
    </>
  );
};
