#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_lgDensity;
uniform float u_smDensity;

vec4 permute(vec4 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

vec2 cellular(vec2 P) {
	#define K 0.142857142857
	#define K2 0.0714285714285
	#define jitter 0.8
	vec2 Pi = mod(floor(P), 289.0);
 	vec2 Pf = fract(P);
	vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
	vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);
	vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
	p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
	vec4 ox = mod(p, 7.0)*K+K2;
	vec4 oy = mod(floor(p*K),7.0)*K+K2;
	vec4 dx = Pfx + jitter*ox;
	vec4 dy = Pfy + jitter*oy;
	vec4 d = dx * dx + dy * dy;
	d.xy = (d.x < d.y) ? d.xy : d.yx;
	d.xz = (d.x < d.z) ? d.xz : d.zx;
	d.xw = (d.x < d.w) ? d.xw : d.wx;
	d.y = min(d.y, d.z);
	d.y = min(d.y, d.w);
	return sqrt(d.xy);
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 F1 = cellular(st * u_lgDensity);
    vec2 F2 = cellular(st * u_smDensity);

    float base = smoothstep(0.1, 1.0, 3.5 * F1.x);
    float detail = smoothstep(0.1, 1.0, 1.5 * F2.x);

    float n = mix(base, detail, 0.0);

    gl_FragColor = vec4(n, n, n, 1.0);
}