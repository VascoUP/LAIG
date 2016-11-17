attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

uniform float dU;
uniform float dV;

uniform float sU;
uniform float sV;

uniform vec4 rgbaC1;
uniform vec4 rgbaC2;
uniform vec4 rgbaCS;
