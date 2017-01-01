[Vertex_Shader]

varying vec3 normal, eyeVec;

#define MAX_LIGHTS 8
#define NUM_LIGHTS 3

varying vec3 lightDir[MAX_LIGHTS];

void main()
{	
    gl_Position = ftransform();		
    normal = gl_NormalMatrix * gl_Normal;
    vec4 vVertex = gl_ModelViewMatrix * gl_Vertex;
    eyeVec = -vVertex.xyz;
    int i;
    for (i=0; i<NUM_LIGHTS; ++i)
        lightDir[i] = vec3(gl_LightSource[i].position.xyz - vVertex.xyz);
}



[Pixel_Shader]
varying vec3 normal, eyeVec;
#define MAX_LIGHTS 8
#define NUM_LIGHTS 3

varying vec3 lightDir[MAX_LIGHTS];

void main (void) {
    vec4 final_color = gl_FrontLightModelProduct.sceneColor;
    vec3 N = normalize(normal);
    int i;

    for (i=0; i<NUM_LIGHTS; ++i) {

        vec3 L = normalize(lightDir[i]);
        float lambertTerm = dot(N,L);

        if (lambertTerm > 0.0)  {
            final_color += gl_LightSource[i].diffuse * gl_FrontMaterial.diffuse * lambertTerm;	
            vec3 E = normalize(eyeVec);
            vec3 R = reflect(-L, N);
            float specular = pow(max(dot(R, E), 0.0), 
            gl_FrontMaterial.shininess);
            final_color += gl_LightSource[i].specular * gl_FrontMaterial.specular * specular;	
        }
    }

    gl_FragColor = final_color;	
}




/**
 *      FROM ANOTHER SITE
 */
 // VERTEX
varying vec3 N;
varying vec3 v;
void main(void)  
{     
   v = vec3(gl_ModelViewMatrix * gl_Vertex);       
   N = normalize(gl_NormalMatrix * gl_Normal);
   gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;  
}
    
 // FRAGMENT
varying vec3 vN;
varying vec3 v; 
#define MAX_LIGHTS 3 
void main (void) 
{ 
   vec3 N = normalize(vN);
   vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);
   
   for (int i=0;i<MAX_LIGHTS;i++)
   {
      vec3 L = normalize(gl_LightSource[i].position.xyz - v); 
      vec3 E = normalize(-v); // we are in Eye Coordinates, so EyePos is (0,0,0) 
      vec3 R = normalize(-reflect(L,N)); 
   
      //calculate Ambient Term: 
      vec4 Iamb = gl_FrontLightProduct[i].ambient; 
      //calculate Diffuse Term: 
      vec4 Idiff = gl_FrontLightProduct[i].diffuse * max(dot(N,L), 0.0);
      Idiff = clamp(Idiff, 0.0, 1.0); 
   
      // calculate Specular Term:
      vec4 Ispec = gl_FrontLightProduct[i].specular 
             * pow(max(dot(R,E),0.0),0.3*gl_FrontMaterial.shininess);
      Ispec = clamp(Ispec, 0.0, 1.0); 
   
      finalColor += Iamb + Idiff + Ispec;
   }
   
   // write Total Color: 
   gl_FragColor = gl_FrontLightModelProduct.sceneColor + finalColor; 
}




/**
 *      FROM ANOTHER SITE
 */
 // FRAGMENT
 fragmentPhong = """
varying vec3 N;
varying vec3 v;    

void main (void)  
{  
   vec4 Iamb = vec4(0.0, 0.0, 0.0, 0.0);
   vec4 Idiff = vec4(0.0, 0.0, 0.0, 0.0);
   vec4 Ispec = vec4(0.0, 0.0, 0.0, 0.0); 
   
   for (int i=0;i<gl_MaxLights;i++)
   {
       vec3 L = normalize(gl_LightSource[i].position.xyz - v);   
       vec3 E = normalize(-v); // we are in Eye Coordinates, so EyePos is (0,0,0)  
       vec3 R = normalize(-reflect(L,N)); 
       
       //calculate Ambient Term:  
       Iamb += gl_FrontLightProduct[i].ambient;    
    
       //calculate Diffuse Term:  
       Idiff += gl_FrontLightProduct[i].diffuse * max(dot(N,L), 0.0);
       Idiff = clamp(Idiff, 0.0, 1.0);     
       
       // calculate Specular Term:
       Ispec += gl_FrontLightProduct[i].specular * pow(max(dot(R,E),0.0),0.3*gl_FrontMaterial.shininess);
       Ispec = clamp(Ispec, 0.0, 1.0); 
    }
   // write Total Color:  
   gl_FragColor = gl_FrontLightModelProduct.sceneColor + Iamb + Idiff + Ispec;     
}