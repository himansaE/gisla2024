//https://codepen.io/ksenia-k/pen/dyaeGgO

export const vertShader = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 u_vertex_texel;

void main () {
    vUv = aPosition * .5 + .5;
    vL = vUv - vec2(u_vertex_texel.x, 0.);
    vR = vUv + vec2(u_vertex_texel.x, 0.);
    vT = vUv + vec2(0., u_vertex_texel.y);
    vB = vUv - vec2(0., u_vertex_texel.y);
    gl_Position = vec4(aPosition, 0., 1.);
}`;

export const fragShaderAdvection = `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D u_velocity_txr;
    uniform sampler2D u_input_txr;
    uniform vec2 u_vertex_texel;
    uniform vec2 u_output_textel;
    uniform float u_dt;
    uniform float u_dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;

        vec2 iuv = floor(st);
        vec2 fuv = fract(st);

        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
        vec2 coord = vUv - u_dt * bilerp(u_velocity_txr, vUv, u_vertex_texel).xy * u_vertex_texel;
        gl_FragColor = u_dissipation * bilerp(u_input_txr, coord, u_output_textel);
        gl_FragColor.a = 1.;
    }
`;

export const fragShaderDivergence = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_velocity_txr;

void main () {
    float L = texture2D(u_velocity_txr, vL).x;
    float R = texture2D(u_velocity_txr, vR).x;
    float T = texture2D(u_velocity_txr, vT).y;
    float B = texture2D(u_velocity_txr, vB).y;

    float div = .5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0., 0., 1.);
}
`;

export const fragShaderPressure = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_pressure_txr;
uniform sampler2D u_divergence_txr;

void main () {
    float L = texture2D(u_pressure_txr, vL).x;
    float R = texture2D(u_pressure_txr, vR).x;
    float T = texture2D(u_pressure_txr, vT).x;
    float B = texture2D(u_pressure_txr, vB).x;
    float C = texture2D(u_pressure_txr, vUv).x;
    float divergence = texture2D(u_divergence_txr, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0., 0., 1.);
}`;

export const fragShaderGradientSubtract = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_pressure_txr;
uniform sampler2D u_velocity_txr;

void main () {
    float L = texture2D(u_pressure_txr, vL).x;
    float R = texture2D(u_pressure_txr, vR).x;
    float T = texture2D(u_pressure_txr, vT).x;
    float B = texture2D(u_pressure_txr, vB).x;
    vec2 velocity = texture2D(u_velocity_txr, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0., 1.);
}`;

export const fragShaderPoint = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D u_input_txr;
uniform float u_ratio;
uniform vec3 u_point_value;
uniform vec2 u_point;
uniform float u_point_size;

void main () {
    vec2 p = vUv - u_point.xy;
    p.x *= u_ratio;
    vec3 splat = pow(2., -dot(p, p) / u_point_size) * u_point_value;
    vec3 base = texture2D(u_input_txr, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.);
}`;

export const fragShaderDisplay = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D u_output_texture;

void main () {
    vec3 C = texture2D(u_output_texture, vUv).rgb;
    float a = max(C.r, max(C.g, C.b));
    a = pow(.1 * a, .1);
    a = clamp(a, 0., 1.);
    gl_FragColor = vec4(1. - C, 1. - a);
}`;
