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
        uniform float uy;
        uniform float height;
        uniform float masterOpacity;
        uniform float boundStrength;

        void main(){
            float y = gl_FragCoord.y;
            float idx = y / 100.0 - fract(y / 100.0);

            // float gap = step(0.5, mod(idx, 2.0));
            // vec4 color = vec4(uColor, opacity);

            // float opacity = cos(idx + time * 0.001);

            // vec4 color = vec4(vec3(1), opacity * 0.05);

            // float opacity = 1.0 - smoothstep(y, uy, uy + height);

            float std = clamp(step(uy, y), boundStrength, 1.0);

            float opacity = 1.0 - distance(y, uy) / (height * std);

            gl_FragColor = vec4(vec3(1), opacity * masterOpacity);
        }
    `
}