
#include "common_fragment.h"

#define mod(x, y) (x - y * floor(x / y))

uniform sampler2D g_Texture0; // {"material":"Albedo"}

uniform float g_Brightness; // {"material":"Brightness","label":"ui_editor_properties_brightness","default":1,"range":[0,2]}
uniform float g_UserAlpha; // {"material":"Alpha","label":"ui_editor_properties_alpha","default":1,"range":[0,1]}

uniform float g_Time;
uniform float g_Daytime;

uniform float simplex_shift = rand(g_Daytime);

varying vec2 v_TexCoord;

float rand(float n){return frac(sin(n) * 43758.5453123);};

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * frac(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
        
    vec2 texCoord = vec2(1.77777777777778 * v_TexCoord.x - 0.388888888888888, v_TexCoord.y);
    
    float t = 0.005 * g_Time + simplex_shift;
    
    float m = 1.;
    for (float i = 0.; i < 25.; ++i) {
        float d = distance(texCoord, vec2((snoise(vec2(t, i)) * 0.888888888888889 + 0.5), (snoise(vec2(-i, -t)) * 0.5 + 0.5)));
        d *= d * 10.;
        if (d < m) {
            m = d;
        }
    }
    vec4 color = vec4(0.5 * m * m, m, 0.5 * m * m, 1.0);

    color.rgb *= g_Brightness;
    color.a *= g_UserAlpha;

    gl_FragColor = color;
}
