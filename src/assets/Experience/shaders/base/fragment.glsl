varying vec2 vUv;
varying float vPosition;

void main() {
   float color = vPosition;
   color += 0.5;
   gl_FragColor = vec4(vUv, 1.0, 1.0);
}