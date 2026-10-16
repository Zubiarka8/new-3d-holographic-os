uniform float uTime;
uniform float uEnergy;
uniform float uPixelRatio;
attribute float aPhase;
varying float vBrightness;
void main() {
  vec3 p = position;
  p.x += sin(uTime * .18 + aPhase) * .12;
  p.y += sin(uTime * .24 + aPhase * 2.0) * .1;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vBrightness = .4 + .6 * pow(.5 + .5 * sin(aPhase + uTime * .5), 2.0);
  gl_PointSize = min(7.0, (1.8 + uEnergy * 1.6) * uPixelRatio * (4.0 / -mv.z));
  gl_Position = projectionMatrix * mv;
}
