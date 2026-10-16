uniform float uTime;
uniform float uEnergy;
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vView;
void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.3);
  float latitude = abs(sin(vPosition.y * 44.0 + uTime * .35));
  float longitude = abs(sin(atan(vPosition.z, vPosition.x) * 27.0));
  float lattice = max(1.0 - smoothstep(.02, .10, latitude), (1.0 - smoothstep(.02, .07, longitude)) * .55);
  float scan = pow(.5 + .5 * sin(vPosition.y * 125.0 - uTime * 1.8), 12.0);
  float plasma = pow(.5 + .5 * sin(vPosition.x * 8.0 + sin(vPosition.y * 7.0 + uTime) + vPosition.z * 6.0 - uTime), 5.0);
  vec3 color = mix(uColor, vec3(.65, .40, 1.0), plasma * .65);
  float light = .055 + fresnel * .85 + lattice * .48 + plasma * .15 + scan * .08;
  gl_FragColor = vec4(color * (1.0 + uEnergy * .7), min(.9, light));
}
