function sigmoid(X) {
	return 1 / (1 + Math.exp(X))
}

function RELU(X) {
	return Math.max(0, X)
}

function TRELU(X) {
    return Math.min(Math.max(0, X), 1)
}

/*
    X = number of layers, vector[0] is inputs, vector[N] is outputs
    Y = number of inputs/outputs (same)
    Z = depth, weights, auto-config
*/

class Tensor {
    constructor(config) {

        this.bias = 1
        this.dimension = {X:3, Y:3}
        this._expected = []
        this.maxError = 0
        this.rate = 0.1
        this.threshold = 0.1
        this._state = []
        
        for (let thing in config) {
            this[thing] = config[thing]
        }

        this.dimension.Z = this.dimension.Y + 1

        this.reset()
    }

    activate() {
        for (let X=1; X < this.dimension.X; X++) {
            for (let Y=0; Y < this.dimension.Y; Y++) {
                let input = this.state(X-1, Y, 0)
                let value = this.bias

                for (let Z=1; Z < this.dimension.Z; Z++) {
                    let weight = this.state(X, Y, Z)
                    value += (input * weight)
                }

                this.state(X, Y, 0, RELU(value))
            }
        }
    }

    get expected() {
        return this._expected
    }

    set expected(arr) {
        this._expected = arr

        this.train()
    }

    get input() {
        return this.vector(0)
    }

    set input(arr) {
        for (let Y=0; Y < this.dimension.Y; Y++) this.state(0, Y, 0, arr[Y])

        this.activate()
    }

    vector(X) {
        let result = []

        for (let Y=0; Y < this.dimension.Y; Y++) result.push(this.state(X, Y, 0))

        return result
    }

    get output() {
        return this.vector(this.dimension.X-1)
    }

    reset() {
        let initial_value = 0.5

        for (let X=0; X < this.dimension.X; X++) {
            for (let Y=0; Y < this.dimension.Y; Y++) {
                this._expected[Y] = 0.5

                for (let Z=0; Z < this.dimension.Z; Z++) {
                    if (X) this.state(X, Y, Z, Math.random())
                    else this.state(X, Y, Z, 0)
                }
            }
        }
    }

    state(X, Y, Z, value) {
        let index = X + (Y * this.dimension.X) + (Z * this.dimension.X * this.dimension.Y)

        if (value !== undefined) this._state[index] = value

        return this._state[index]
    }

    train() {
        let error = []
        let expectation = this._expected

        this.maxError = 0

        for (let Y=0; Y < this.dimension.Y; Y++) {
            error[Y] = expectation[Y] - this.state(this.dimension.X-1, Y, 0)
console.log(error)
            this.maxError = Math.max(Math.abs(error[Y]), this.maxError)
        }

        for (let X=this.dimension.X-1; X >= 1; X--) {

            for (let Y=0; Y < this.dimension.Y; Y++) {
                for (let Z=1; Z < this.dimension.Z; Z++) {
                    let input = this.state(X-1,Y,0)
                    let old_value = this.state(X,Y,Z)
                    let this_expectation = error[Y] / old_value

                    let diff = error[Y] * input * this.rate// * this.state(X-1, Y, 0)
                    let new_value = old_value + diff

                    this.state(X,Y,Z,new_value)
                }
            }

            // this.activate()

            // expectation = this.vector(X)
        }

    }
}
