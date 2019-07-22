class Perceptron {
	constructor(opts) {
		this.bias = opts.bias || 1
		this.dimension = opts.dimension || 4
		this.rate = opts.rate || 0.1
		
		this.signal = 0
		this.error = 1
		
		this.expect = new Array(this.dimension)
        this.expect.fill(0.5)

		this.weight = new Array(this.dimension)
        this.weight.fill(0.5)
	}

	activate(inputs) {
		this.signal = this.bias

		for (let I = 0; I < inputs.length; ++I) {
			this.signal += this.weight[I] * inputs[I]
		}

		this.signal = Math.max(0, this.signal)
	}

	train(inputs, output) {
		let inputs = inputter.slice()

		this.error = output - this.signal

		for (let I in this.weight) {
			this.expect[I] = Math.sqrt(Math.abs(this.error / this.weight[I]))
			this.weight[I] = this.weight[I] + (this.error * inputs[I] * this.rate)
		}
	}
}
