const vertexShader = `
uniform float epsilon_1;
uniform float epsilon_2;

varying vec3 vNormal;

float signed_pow(float x, float y) {
    return sign(x) * pow(abs(x), y);
}

void main() {
    float eta = position.x * 3.14159;
    float omega = position.y * 3.14159 * 2.0;
    
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
`

const fragmentShader = `
varying vec3 vNormal;

void main() {
    gl_FragColor = vec4(1.0);
}
`

export {vertexShader, fragmentShader};
