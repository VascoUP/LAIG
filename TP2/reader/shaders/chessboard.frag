#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_texture;

uniform float dU;
uniform float dV;

uniform float sU;
uniform float sV;

uniform vec4 rgbaC1;
uniform vec4 rgbaC2;
uniform vec4 rgbaCS;

varying vec4 coords;

void main() {
    int indexU = coords.x * dU;
    int indexV = coords.z * dV;
    vec2 texcoord = vec2(coords.x, coords.z);
    vec3 color;

    // Color cS
    if( indexU == sU && indexV == sV ) {
        color = rgbaCS.rgb;
    }
    // Color c1
    else if( (indexU % 2 == 0 && indexV % 2 == 0) ||
        (indexU % 2 != 0 && indexV % 2 != 0) {
        color = rgbaC1.rgb;
    } 
    //Color c2
    else {
        color = rgbaC2.rgb;
    }

    gl_FragColor.rgb = (texture2D(u_texture, texcoord).rgb + color) / 2;
    gl_FragColor.a = 1.0;
}