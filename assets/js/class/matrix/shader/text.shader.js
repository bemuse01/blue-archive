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

        varying vec2 vUv;

        void main(){
            vec4 tex1 = texture(uTexture, vUv);
            vec4 tex2 = texture(uTexture, vUv - vec2(0.0025, 0.0));
            tex2.rgb *= 0.4;

            vec4 color = tex1 + tex2;
            vec4 pColor = step(0.1, color) * color; // 텍스트 자국 제거
            

            gl_FragColor = pColor;
        }
    `
}