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
        // uniform vec3 uColor;
        // uniform float burnSize;

        uniform float time;
        uniform float uy;
        uniform float height;
        uniform float masterOpacity;
        uniform float boundStrength;
        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        ${ShaderMethod.snoise3D()}
        ${ShaderMethod.executeNormalizing()}

        void main(){
            vec2 coord = gl_FragCoord.xy;
            float x = gl_FragCoord.x;
            float y = gl_FragCoord.y;
            float idx = y / 100.0 - fract(y / 100.0);

            // float gap = step(0.5, mod(idx, 2.0));
            // vec4 color = vec4(uColor, opacity);

            // float opacity = cos(idx + time * 0.001);

            // vec4 color = vec4(vec3(1), opacity * 0.05);

            // float opacity = 1.0 - smoothstep(y, uy, uy + height);

            // float noise = snoise3D(vec3(x * 0.0025, 1.0, time * 0.0001));
            // float aboveStd = executeNormalizing(noise, 0.25, 0.5, -1.0, 1.0);
            // float aboveStd2 = executeNormalizing(noise, 0.95, 1.0, -1.0, 1.0);

            float std = clamp(step(uy, y), boundStrength, 1.0);

            // float opacity = 1.0 - pow(distance(y, uy) / (height * std), 0.35);

            float rn = (snoise3D(vec3(coord * 0.15, time * 0.01)) + 1.0) * 0.5 * 0.1;

            float dist = distance(y, uy);
            float pDist = smoothstep(0.0, height * 0.6, dist) * dist;
            float opacity = 1.0 - pow(pDist / (height * std), 0.3);

            float powedDist = pow(dist / height, -1.5);
            vec2 distortedUV = vUv + vec2(powedDist * 0.001, 0.0);
            vec4 diffuse = texture(tDiffuse, distortedUV);

            float c = diffuse.r + diffuse.g + diffuse.b;
            // vec4 color = vec4(c == 0.0 ? vec3(1) : diffuse.rgb * 2.0, opacity + rn);
            vec4 color = vec4(vec3(1), opacity + rn);
            
            diffuse.a *= opacity;

            vec4 finalColor = color + diffuse;

            gl_FragColor = finalColor;
        }
    `
}