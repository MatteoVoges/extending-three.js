export const instancedVertexShader = /* glsl */`
precision highp float;

attribute float eta;
attribute float omega;
attribute float u;

attribute float epsilon1;
attribute float epsilon2;

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;


const float tolerance = 1e-15;

float signed_pow(float x, float y) {
    if ( abs(round(x) - x) < tolerance ) x = round(x);

    if (x == 0.0) return 0.0;

    return sign(x) * pow(abs(x), y);
}

void main() {

    // updated position
    
    vec3 superquadricPosition;
    superquadricPosition.x = -signed_pow(sin(eta), epsilon1) * signed_pow(cos(omega), epsilon2);
    superquadricPosition.y = signed_pow(cos(eta), epsilon1);
    superquadricPosition.z = signed_pow(sin(eta), epsilon1) * signed_pow(sin(omega), epsilon2);
    if (u == 1.0) superquadricPosition.z = 0.0;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(superquadricPosition, 1.0);


    // updated normal

    vec3 superquadricNormal;
    superquadricNormal.x = - signed_pow(sin(eta), 2.0 - epsilon1) * signed_pow(cos(omega), 2.0 - epsilon2);
    superquadricNormal.y = signed_pow(cos(eta), 2.0 - epsilon1);
    superquadricNormal.z = signed_pow(sin(eta), 2.0 - epsilon1) * signed_pow(sin(omega), 2.0 - epsilon2);

    vNormal = normalMatrix * superquadricNormal;

    
    // fragment shader variables

    vec4 mvPosition = modelViewMatrix * vec4(superquadricPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(superquadricPosition, 1.0)).xyz;
}`;
