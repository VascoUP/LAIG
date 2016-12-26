#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform bool uUseTexture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform int LightCount;

struct lightProperties {
    vec4 position;                  // Default: (0, 0, 1, 0)
    vec4 ambient;                   // Default: (0, 0, 0, 1)
    vec4 diffuse;                   // Default: (0, 0, 0, 1)
    vec4 specular;                  // Default: (0, 0, 0, 1)
    vec4 half_vector;
    vec3 spot_direction;            // Default: (0, 0, -1)
    float spot_exponent;            // Default: 0 (possible values [0, 128]
    float spot_cutoff;              // Default: 180 (possible values [0, 90] or 180)
    float constant_attenuation;     // Default: 1 (value must be >= 0)
    float linear_attenuation;       // Default: 0 (value must be >= 0)
    float quadratic_attenuation;    // Default: 0 (value must be >= 0)
    bool enabled;                   // Default: false
};

#define NUMBER_OF_LIGHTS 8

uniform lightProperties LightInfos[NUMBER_OF_LIGHTS];

varying vec2 TexCoords;

varying vec3 lightDir_ts;
varying vec3 viewDir_ts;

void main(void)
{
    TexCoords = aTextureCoord;

    vec3 Normal_ns = uNMatrix * vec3(0.0, 1.0, 0.0);
    vec3 Tangent_ns = uNMatrix * vec3(1.0, 0.0, 0.0);
    vec3 Bitangent_ns = uNMatrix * vec3(0.0, 0.0, -1.0);

    mat3 TBN =  mat3(
        Tangent_ns.x, Bitangent_ns.x, Normal_ns.x,
            Tangent_ns.y, Bitangent_ns.y, Normal_ns.y,
                Tangent_ns.z, Bitangent_ns.z, Normal_ns.z);

    vec4 Position_cs = uMVMatrix * aVertexPosition;

    lightDir_ts = TBN * (vec3(LightInfos[0].position) - Position_cs.xyz);
    viewDir_ts = TBN * -Position_cs.xyz;

    gl_Position = uPMatrix * aVertexPosition;
}