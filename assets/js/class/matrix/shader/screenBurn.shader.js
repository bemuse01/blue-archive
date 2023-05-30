export default {
    vertex: `
        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        uniform vec3 uColor;
        uniform float burnSize;

        void main(){
            float y = gl_FragCoord.y;
            float idx = y / burnSize - fract(y / burnSize);

            float opacity = step(0.5, mod(idx, 2.0));
            vec4 color = vec4(uColor, opacity);

            gl_FragColor = color;
        }
    `
}