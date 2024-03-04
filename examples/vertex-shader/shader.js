const vertexShader = `
uniform float epsilon_1;
uniform float epsilon_2;

attribute float eta;
attribute float omega;
attribute float u;

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
    superquadricPosition.x = -signed_pow(sin(eta), epsilon_1) * signed_pow(cos(omega), epsilon_2);
    superquadricPosition.y = signed_pow(cos(eta), epsilon_1);
    superquadricPosition.z = signed_pow(sin(eta), epsilon_1) * signed_pow(sin(omega), epsilon_2);
    if (u == 1.0) superquadricPosition.z = 0.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(superquadricPosition, 1.0);


    // updated normal

    vec3 superquadricNormal;
    superquadricNormal.x = - signed_pow(sin(eta), 2.0 - epsilon_1) * signed_pow(cos(omega), 2.0 - epsilon_2);
    superquadricNormal.y = signed_pow(cos(eta), 2.0 - epsilon_1);
    superquadricNormal.z = signed_pow(sin(eta), 2.0 - epsilon_1) * signed_pow(sin(omega), 2.0 - epsilon_2);

    vNormal = normalMatrix * superquadricNormal;

    
    // fragment shader variables

    vec4 mvPosition = modelViewMatrix * vec4(superquadricPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(superquadricPosition, 1.0)).xyz;
}
`;

export {vertexShader};
