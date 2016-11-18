#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_texture;


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
   vec2 texcoord = vec2(coords.x, coords.y);
   gl_FragColor = texture2D(u_texture, texcoord);

   vec4 color;

    if( indexU == sU && indexV == sV )
        color = cs;
    else if( (mod(indexU, 2.0) == 0.0 && mod(indexV, 2.0) == 0.0) || 
            (mod(indexU, 2.0) != 0.0 && mod(indexV, 2.0) != 0.0) ) 
        color = c1;
    else
        color = c2;

    gl_FragColor.rgba = (texture2D(u_texture, texcoord).rgba + color.rgba) / 2.0;
}