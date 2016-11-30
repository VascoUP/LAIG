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

void main() {
	vec4 vertex=vec4(aVertexPosition, 1.0);

	coords.xy=vertex.xy+0.5;
	coords.z=vertex.z;

    float indexU = coords.x * dU;

    if(floor(indexU) == indexU)
        indexU = floor(indexU);
    else 
        indexU = floor(indexU)+1.0;

    float indexV = coords.y * dV;

    if(floor(indexV) < indexV)
        indexV = floor(indexV)+1.0;
    else
        indexV = floor(indexV);

   int indexU_floor = int(indexU);
   int indexV_floor = int(indexV);    

    if( (coords.x * dU == sU || indexU == sU+1.0) && 
        (coords.y * dV == sV || indexV == sV+1.0) && 
        sV >= 0.0 && sU >= 0.0 )
        vertex.z += 0.1;

	gl_Position = uPMatrix * uMVMatrix * vertex;
}
