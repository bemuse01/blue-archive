import ShaderMethod from '../../../method/method.shader.js'

export default {
    vertex: `
        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        // uniform vec3 uColor;
        // uniform float burnSize;

        uniform float time;
        uniform float masterOpacity;

        ${ShaderMethod.snoise3D()}

        void main(){
            vec2 coord = gl_FragCoord.xy;

            float opacity = (snoise3D(vec3(coord * 0.15, time * 0.01)) + 1.0) * 0.5;

            vec4 color = vec4(vec3(1), opacity * masterOpacity);

            gl_FragColor = color;
        }
    `
}