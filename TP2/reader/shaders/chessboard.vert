#ifdef GL_ES
precision highp float;
#endif

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

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

varying vec4 coords;
varying float indexU;
varying float indexV;

void main() {
	vec4 vertex=vec4(aVertexPosition, 1.0);

	coords.xy=vertex.xy+0.5;
	coords.z=vertex.z;

    indexU = floor(coords.x * dU);
    indexV = floor(coords.y * dV);

    if( indexU == sU && indexV == sV )
        vertex.z += 0.1;

	gl_Position = uPMatrix * uMVMatrix * vertex;
}
