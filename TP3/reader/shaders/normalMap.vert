#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform sampler2D normaMap;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

void main() {
	vec4 vertex=vec4(aVertexPosition, 1.0);
    vec2 texturePosition = (vertex.xy + 0.5) / 4;

    vec4 normal;
    normal.xyz = normalize(texture2D(normaMap, texturePosition).xyz * 2.0 - 1.0);
    normal.a = 1.0;
    
	gl_Position = normal * uMVMatrix * vertex;
}