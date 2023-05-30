import ShaderMethod from '../../../method/method.shader.js'

export default {
    vertex: `
        varying vec2 vUv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragment: `
        uniform sampler2D uTexture;
        uniform float uTime;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main(){
            // vec2 vUv2 = vUv * 2.0 - 1.0;
            vec2 vUv3 = vUv;

            // float factor = 1.0 - dot(vUv2, vUv2);
            // float factor = 1.0 - length(vUv2);

            vec2 glitch = vec2(
                sin(uTime * 50.0) * 1.0,
                cos(uTime * 60.0 * 0.00001) * 1.0
            );

            vUv3 += mix(-vec2(0.1), vec2(0.05), fract(vUv + glitch));

            vec4 color = texture(uTexture, vUv3);

            gl_FragColor = vec4(color.rgb, 1.0);
        }
    `
}