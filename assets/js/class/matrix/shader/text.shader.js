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
        uniform float masterOpacity;
        uniform float shadowOpacity;
        uniform float trailThreshold;
        uniform vec2 shadowPosition;
        uniform vec2 resolution;
        uniform float time;
        uniform float distortion;
        uniform vec3 distortedColor;

        varying vec2 vUv;

        ${ShaderMethod.rand()}
        ${ShaderMethod.snoise3D()}

        void main(){
            vec2 coord = gl_FragCoord.xy;
            vec2 uv = gl_FragCoord.xy / resolution;

            // float distorted = sin(uv.y * 50.0 + time * 0.01) * 0.01 * distortion;
            // float offset = sin(time * 0.015) * 0.01 * distortion;
            // float shift = cos(time * 0.020) * 0.01 * distortion;
            // vec2 distortedUV = vec2(uv.x + distorted, uv.y + offset) + shift;

            // float amount = 0.025;
            // float speed = 0.025;
            float offset = snoise3D(vec3(coord * 0.03, time * 0.1)) * 0.0125 * distortion;
            vec2 distortedUV = vec2(uv.x + offset, uv.y);

            vec4 tex1 = texture(uTexture, distortedUV);
            vec4 tex2 = texture(uTexture, distortedUV - shadowPosition);
            tex2.rgb *= shadowOpacity;

            vec4 color = tex1 + tex2;
            vec4 pColor = step(trailThreshold, color) * color; // 텍스트 자국 제거

            float opacity = step(trailThreshold, pColor.r + pColor.g + pColor.b) * pColor.a; // 배경 투명화

            // pColor.rgb = pColor.rgb + distortedColor * distortion;

            gl_FragColor = vec4(pColor.rgb, opacity);
        }
    `
}