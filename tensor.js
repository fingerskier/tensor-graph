/*
    I'm starting w/ 3D, once that's working I'll extend to N-D
*/

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
    constructor() {
        this.dim = {X:3, Y:3, Z:4}
        this.rate = 0.1
        this.state = []

        for (let X=0; X < this.dim.X; X++) {
            for (let Y=0; Y < this.dim.Y; Y++) {
                for (let Z=0; Z < this.dim.Z; Z++) {
                    this.signal(X, Y, Z, Math.random())
                }
            }
        }
    }

    activate() {
        for (let X=1; X < this.dim.X; X++) {
            for (let Y=0; Y < this.dim.Y; Y++) {
                for (let Z=1; Z < this.dim.Z; Z++) {
                    let input = this.signal(X-1, Y, 0)
                    let weight = this.signal(X, Y, Z)
                    let value = input * weight
console.log(input,weight,value)
                    this.signal(X, Y, 0, TRELU(value))
                }
            }
        }
    }

    output() {
        let result = []

        for (let Y=0; Y < this.dim.Y; Y++) result.push(this.signal(this.dim.X-1, Y, 0))

        return result
    }

    signal(X, Y, Z, value) {
        let index = X + (Y * this.dim.X) + (Z * this.dim.X * this.dim.Y)

        if (value !== undefined) this.state[index] = value

        return this.state[index]
    }

    train(expected) {
        let error = []
        for (let X=0; X < this.dim.X; X++) {
            error[X] = 1 + expected[X] - this.signal(this.dim.X, X, 0)
        }

        for (let X=this.dim.X-1; X > 1; X++) {
            for (let Y=0; Y < this.dim.Y; Y++) {
                for (let Z=1; Z < this.dim.Z; Z++) {
                    old_value = this.signal(X,Y,Z)
                    diff = error[Y] * this.signal(X-1, Y, 0) * this.rate
                    this.signal(X,Y,Z,old_value+diff)
                }
            }
        }
    }
}