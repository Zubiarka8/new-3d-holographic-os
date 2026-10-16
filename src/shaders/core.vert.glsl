uniform float uTime;
uniform float uEnergy;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vView;
void main() {
  vec3 p = position;
  float wave = sin(p.y * 9.0 + uTime * 1.6) * cos(p.x * 7.0 - uTime * .8);
  p += normal * wave * (.014 + uEnergy * .028);
  vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-viewPosition.xyz);
  vPosition = p;
  gl_Position = projectionMatrix * viewPosition;
}
