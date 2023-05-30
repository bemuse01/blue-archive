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

        varying vec2 vUv;

        void main(){
            vec4 tex1 = texture(uTexture, vUv);
            vec4 tex2 = texture(uTexture, vUv - shadowPosition);
            tex2.rgb *= shadowOpacity;

            vec4 color = tex1 + tex2;
            vec4 pColor = step(trailThreshold, color) * color; // 텍스트 자국 제거

            float opacity = step(trailThreshold, pColor.r + pColor.g + pColor.b) * pColor.a;

            gl_FragColor = vec4(pColor.rgb, opacity);
        }
    `
}