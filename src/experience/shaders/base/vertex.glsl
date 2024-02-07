uniform float uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vPosition;



void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency + uTime * 0.01) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vUv = uv;
    vPosition = modelPosition.z;
    gl_Position = projectedPosition;
}