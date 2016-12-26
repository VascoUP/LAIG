#ifdef GL_ES
precision highp float;
#endif

varying vec2 TexCoords;

uniform sampler2D uSampler;
uniform sampler2D BumpMapSampler;

varying vec3 lightDir_ts;
varying vec3 viewDir_ts;

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

struct materialProperties {
    vec4 ambient;                   // Default: (0, 0, 0, 1)
    vec4 diffuse;                   // Default: (0, 0, 0, 1)
    vec4 specular;                  // Default: (0, 0, 0, 1)
    vec4 emission;                  // Default: (0, 0, 0, 1)
    float shininess;                // Default: 0 (possible values [0, 128])
};

#define NUMBER_OF_LIGHTS 8

uniform lightProperties LightInfos[NUMBER_OF_LIGHTS];
uniform materialProperties MaterialInfos;

vec3 Basic_Phong_Shading(vec3 bumpNormalDir, vec3 lightDir, vec3 viewDir, vec3 texDiffuseColor)
{
    vec3 reflectDir = reflect(-lightDir, bumpNormalDir);

    vec3 Ambient = LightInfos[0].ambient * MaterialInfos.ambient;
    vec3 Diffuse = LightInfos[0].diffuse * MaterialInfos.diffuse * max(dot(lightDir, bumpNormalDir), 0.0) * texDiffuseColor;
    vec3 Specular = LightInfos[0].specular * MaterialInfos.specular * pow(max(dot(reflectDir, viewDir), 0.0), MaterialInfos.shininess);

    return (Ambient + Diffuse + Specular);
}

void main(void)
{
    vec3 LightIntensity = vec3(0.0);

    vec4 texDiffuseColor = texture2D(uSampler, TexCoords);

    vec3 bumpNormalDir_ts = normalize(texture2D(BumpMapSampler, TexCoords).xyz * 2.0 - 1.0);

    LightIntensity = Basic_Phong_Shading(
        -bumpNormalDir_ts, normalize(lightDir_ts), normalize(viewDir_ts), texDiffuseColor.rgb
    );

    gl_FragColor = vec4(LightIntensity, 1.0);
}