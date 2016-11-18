attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float dU;
uniform float dV;

uniform float sU;
uniform float sV;

uniform vec4 rgbaC1;
uniform vec4 rgbaC2;
uniform vec4 rgbaCS;

varying vec4 coords;

void main() {
	vec4 vertex = vec4(aVertexPosition+aVertexNormal, 1.0);

	gl_Position = uPMatrix * uMVMatrix * vertex;

	coords = vertex;
}