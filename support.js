function sigmoid(X) {
	return 1 / (1 + Math.exp(-X))
}

function dsigmoid(X) {
    return sigmoid(X) * (1 - sigmoid(X))
}

function RELU(X) {
	return Math.max(0, X)
}

function TRELU(X) {
    return Math.min(Math.max(0, X), 1)
}

function v_multiply(a,b) {
    let result = []

    for (let I in a) result.push(a[I]*b[I])

    return result
}