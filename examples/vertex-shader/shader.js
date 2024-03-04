const vertexShader = `
uniform float epsilon_1;
uniform float epsilon_2;

varying vec3 vNormal;

const float tolerance = 1e-15;

float signed_pow(float x, float y) {
    if ( abs(round(x) - x) < tolerance ) x = round(x);

    return sign(x) * pow(abs(x), y);
}

void main() {
    float eta = atan(position.z, position.x);
    float omega = acos(position.y);
    
    vec3 newPosition;
    newPosition.x = -signed_pow(sin(eta), epsilon_1) * signed_pow(cos(omega), epsilon_2);
    newPosition.y = signed_pow(cos(eta), epsilon_1);
    newPosition.z = signed_pow(sin(eta), epsilon_1) * signed_pow(sin(omega), epsilon_2);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vec3 newNormal;
    newNormal.x = - signed_pow(sin(eta), 2.0 - epsilon_1) * signed_pow(cos(omega), 2.0 - epsilon_2);
    newNormal.y = signed_pow(cos(eta), 2.0 - epsilon_1);
    newNormal.z = signed_pow(sin(eta), 2.0 - epsilon_1) * signed_pow(sin(omega), 2.0 - epsilon_2);

    vNormal = normalMatrix * newNormal;
}
`;

export {vertexShader};
