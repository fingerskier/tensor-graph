function sigmoid(X) {
	return 1 / (1 + Math.exp(-X))
}
function dsigmoid(X) {
    return sigmoid(X) * (1 - sigmoid(X))
}


function tanh(X) {
    return Math.tanh(X)
}
function dtanh(X) {
    return 1 - (Math.tanh(X) * Math.tanh(X))
}

function RELU(X) {
	return Math.max(0, X)
}
function dRELU(X) {
    return (X <= 0) ? 0 : 1
}

function TRELU(X) {
    return Math.min(Math.max(0, X), 1)
}
function dTRELU(X) {
    return (X <= 0) ? 0 : 1
}

