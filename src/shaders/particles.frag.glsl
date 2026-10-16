uniform vec3 uColor;
varying float vBrightness;
void main() {
  float d = length(gl_PointCoord - .5);
  float glow = exp(-d * d * 24.0);
  gl_FragColor = vec4(uColor, glow * vBrightness * .85);
}
