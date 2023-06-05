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
        ${ShaderMethod.executeNormalizing()}

        void main(){
            vec2 coord = gl_FragCoord.xy;
            vec2 uv = gl_FragCoord.xy / resolution;


            // texts
            float offset = snoise3D(vec3(coord * 0.03, time * 0.1)) * 0.0125 * distortion;
            vec2 distortedUV = vec2(uv.x + offset, uv.y);

            vec4 text1 = texture(uTexture, distortedUV);
            vec4 text2 = texture(uTexture, distortedUV - shadowPosition);
            text2.rgb *= shadowOpacity;

            vec4 finalText = text1 + text2;
            vec4 rippedTrailText = step(trailThreshold, finalText) * finalText; // 텍스트 자국 제거
            float textOpacity = step(trailThreshold, rippedTrailText.r + rippedTrailText.g + rippedTrailText.b) * rippedTrailText.a; // 배경 투명화
            vec4 textColor = vec4(rippedTrailText.rgb, textOpacity);


            // white noise line
            

            gl_FragColor = textColor;
        }
    `
}