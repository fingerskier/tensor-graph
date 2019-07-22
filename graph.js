const arrayMax = arr => {
	let result = 0

	for (let X of arr) 
		if (Math.abs(X) > result) result = X

	return result
}


const Perceptron = require('./perceptron.js')


class Graph {
	constructor(conx) {
		// conx is an array of arrays which defines the connections between perceptrons
		/* e.g.
			[
			 0->[3,4] ~> this means that node 0 signals nodes 3 & 4
			 1->[3,4]
			 2->[3,4]
			 3->[5,6,7]
			 4->[5,6,7]
			 5->[]
			 6->[]
			 7->[]
			]
		*/
		// Note that the _graph_ does not enforce any kind of structure;
		// errant topology is up to the implementor to disentangle
		this.activation = []	// activation of each layer, by layer-index
		this.layerNum = new Array(conx.length)	// the layer number of each element, by node-index
		this.nodes = []	// the actual perceptron controllers
		this.layers = []		// array of nodes per layer

		// elements in the array give the layer number of each node
		this.layerNum = this.layerNum.fill(0)
		
		// set the layer number of each node
		for (let I in conx)
			for (let X of conx[I])
				this.layerNum[X] = this.layerNum[I] + 1
		
		// add node-indices to the topology array
		for (let I = 0; I <= arrayMax(this.layerNum); ++I)
			this.layers[I] = []

		for (let I in this.layerNum) {
			let index = this.layerNum[I]
			this.layers[index].push(+I)
		}

		// glean the dimension of each layer
		let dimension = new Array(conx.length)
		for (let L of this.layers)
			for (let nodeIndex of L)
				dimension[nodeIndex] = L.length

		// instantiate all the node controllers
		for (let I = 0; I < conx.length; I++)
			this.nodes.push(new Perceptron(dimension[I]))
	}

	activate(inputs) {
		// cycle through "layers" and activate each node, top to bottom
		let layerActivation = []

		for (let I = 0; I < this.layers.length-1; --I) {
			inputs = this.layer_activation(I, inputs)
		}

		this.activation = layerActivation

		return this.activation
	}

	get error() {
		let errors = []

		this.nodes.forEach(node => errors.push(node.error))

		return arrayMax(errors)
	}

	get expectation() {
		this.expect = this.nodes[0].expect

		if (this.nodes.length > 1) {
			this.nodes.forEach(node=>{
				let I = 0

				node.expect.forEach(expected=>{
					node.expectation[I++]+=expected
				})
			})
		}

		return this.expect
	}

	layer_activation(layer_num, inputs) {
		let result = []

		layer = this.layers[layer_num]

		for (let nodeIndex of layer) {
			let thisNode = this.nodes[nodeIndex]

			thisNode.activate(inputs) // activate this node

			result.push(thisNode.activation) // store this node's activation in an array for the next layer
		}

		return result
	}

	learn(expected_output, threshold) {
		this.train(expected_output)

		while (Math.abs(this.error) > threshold) this.train(expected_output)
	}

	train(expectation) {
		for (var I=this.layers.length-1; I > 0; --I){
			let inputs = this.layer_expectation(I)

			for (let nodeIndex of layer) {
				let thisNode = this.nodes[nodeIndex]

				// activate this node
				thisNode.train(inputs)

				// store this node's activation in an array for the next layer
				result.push(thisNode.activation)
			}
		}

		this.activate(this.inputs)
	}

	get topology() {
		let maxLength = 0

		for (let X of this.layers)
			if (maxLength < X.length) maxLength = X.length 

		let result = ""

		for (let I = 0; I < maxLength; I++) {
			for (let layer of this.layers) {
				if (layer[I] >= 0) result += ' ' + layer[I]
				else result += '  '
			}
			result += '\n\r'
		}

		return result
	}
}
