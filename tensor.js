function sigmoid(X) {
	return 1 / (1 + Math.exp(X))
}

function RELU(X) {
	return Math.max(0, X)
}

function TRELU(X) {
    return Math.min(Math.max(0, X), 1)
}

class Tensor {
    constructor(config) {

        this.bias = 1
        this.dimension = {X:3, Y:3, Z:4}
        this._expected = [0.5, 0.5, 0.5]
        this.maxError = 0
        this.rate = 0.1
        this.threshold = 0.1
        this._state = []

        for (let thing in config) {
            this[thing] = config[thing]
        }

        for (let X=0; X < this.dimension.X; X++) {
            for (let Y=0; Y < this.dimension.Y; Y++) {
                for (let Z=0; Z < this.dimension.Z; Z++) {
                    this.state(X, Y, Z, 0.5)
                }
            }
        }
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

    set expected(arr) {
        this._expected = arr

        this.correct()
    }

    set input(arr) {
        for (let Y=0; Y < this.dimension.Y; Y++) this.state(0, Y, 0, arr[Y])

        this.activate()
    }

    layer(X) {
        let result = []

        for (let Y=0; Y < this.dimension.Y; Y++) result.push(this.state(X, Y, 0))

        return result
    }

    get output() {
        return this.layer(this.dimension.X-1)
    }

    state(X, Y, Z, value) {
        let index = X + (Y * this.dimension.X) + (Z * this.dimension.X * this.dimension.Y)

        if (value !== undefined) this._state[index] = value

        return this._state[index]
    }

    train(new_threshold) {
        this.threshold = new_threshold || this.threshold
        while (this.maxError > this.threshold) this.correct()
    }

    correct() {
        let error = []
        let expectation = this._expected

        this.maxError = 0

        for (let Y=0; Y < this.dimension.Y; Y++) {
            error[Y] = expectation[Y] - this.state(this.dimension.X-1, Y, 0)

            this.maxError = Math.max(Math.abs(error[Y]), this.maxError)
        }

        for (let X=this.dimension.X-1; X >= 1; X--) {
            for (let Y=0; Y < this.dimension.Y; Y++) {
                for (let Z=1; Z < this.dimension.Z; Z++) {
                    let old_value = this.state(X,Y,Z)
                    let diff = error[Y] * this.state(X-1, Y, 0) * this.rate
                    let new_value = old_value+diff

                    this.state(X,Y,Z,new_value)
                }
            }
        }

        this.activate()
    }
}