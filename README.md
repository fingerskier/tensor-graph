# tensor-graph
A graph of tensors which can be composed and trained to solve problems.

## Usage
let T = new Tensor


## Tensor
This tensor is a 3D matrix representation of a small MLP.
The top layer represents the signal values.
- First column = input vector
- Last column = output vector
Lower layers store the weights.
Error costing is done simply via diffing with a given expectation vector.

TODO: perhaps N-dimensional...


## Graph
