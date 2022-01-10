
#include "common_vertex.h"

uniform mat4 g_ModelViewProjectionMatrix;
uniform vec4 g_Texture0Rotation;
uniform vec2 g_Texture0Translation;

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;

void main() {
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
	
	v_TexCoord.xy = a_TexCoord;
}
