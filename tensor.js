/*
    X = number of layers, vector[0] is inputs, vector[N] is outputs
    Y = number of inputs/outputs (same)
    Z = depth, weights, auto-config

    plane0 ~ (X,Y,0) ~ is the outputs
    plane1 ~ (X,Y,1) ~ is the errors
    plane2+ ~ (X,Y,Z>1) ~ is the weights
*/

class Tensor {
    constructor(config) {

        this.bias = 0.0001
        this.dimension = {X:3, Y:3}
        this._expected = []
        this.maxError = 0
        this.rate = 0.1
        this.threshold = 0.1
        this._state = []

        for (let thing in config) {
            this[thing] = config[thing]
        }

        this.dimension.Z = this.dimension.Y + 2

        this.reset()
    }


    get expected() {
        return this._expected
    }

    set expected(arr) {
        this._expected = arr

        this.train()
    }

    get input() {
        return this.layer(0)
    }

    set input(arr) {
        for (let Y=0; Y < this.dimension.Y; Y++) this.state(0, Y, 0, arr[Y])

        this.activate()
    }

    layer(X, Z=0) {
        let result = []

        for (let Y=0; Y < this.dimension.Y; Y++) result.push(this.state(X, Y, Z))

        return result
    }

    get output() {
        return this.vector(this.dimension.X-1)
    }

    error_vector(X) {
        let result = []

        for (let Y=0; Y < this.dimension.Y; Y++) result.push(this.state(X,Y,1))

        return result
    }

    weight_vector(X,Y) {
        let result = []

        for (let Z=2; Z < this.dimension.Z; Z++) result.push(this.state(X,Y,Z))

        return result
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

    activate() {
        for (let X=1; X < this.dimension.X; X++) {
            for (let Y=0; Y < this.dimension.Y; Y++) {
                let value = this.bias

                for (let Z=2; Z < this.dimension.Z; Z++) {
                    let input = this.state(X-1, Z-2, 0)
                    let weight = this.state(X, Y, Z)

                    value += (input * weight)
                }

                this.state(X, Y, 0, sigmoid(value / this.dimension.Y))
            }
        }
    }

    cost(expectation) {
        // calculate primary errors
        for (let Y=0; Y < this.dimension.Y; Y++) {
            let old_value = this.state(this.dimension.X-1,Y,0)
            let this_error = expectation[Y] - old_value

            this.state(this.dimension.X-1, Y, 1, this_error)
        }

        // calculate subsequent errors
        for (let X=this.dimension.X-2; X > 0; X--) {    // start at the first hidden layer
            for (let Y=0; Y < this.dimension.Y; Y++) {
                error = weight_v * err_v

                let primary_error = this.state(X+1,Y,1)
                let this_error = 0

                for (let Z=2; Z < this.dimension.Z; Z++) {
                    let this_weight = this.state(X,Y,Z)
                    let weight_sum = this.weight_vector(X,Y).reduce((a,b)=>{return a+b})

                    this_error += (this_weight / weight_sum)
                }

                console.log(this_error, primary_error)
                this_error *= primary_error

                this.state(X,Y,1, primary_error)
            }
        }
    }

    train() {
        let error = []
        let expectation = this._expected.slice()

        for (let Y=0; Y < this.dimension.Y; Y++) {
            error[Y] = expectation[Y] - this.state()
        }

        for (let X=this.dimension.X-1; X >= 1; X--) {
            for (let Y=0; Y < this.dimension.Y; Y++) {
                let error = this.state(X,Y,1)
                for (let Z=2; Z < this.dimension.Z; Z++) {
                    let input = this.state(X-1,Y,0)
                    let old_value = this.state(X,Y,Z)
                    let weight_error = error * this.weight_vector(X,Y,Z)
                    
                    let diff = this.rate * old_value * weight_error * input
                    
                    let new_value = old_value + diff
                    
                    this.state(X,Y,Z,new_value)
                }
            }
            
            // this.activate()
            expectation = this.layer(X)
        }

        this.maxError = 0
        for (let Y=0; Y < this.dimension.Y; Y++) {
            this.maxError = Math.max(Math.abs(error[Y]), this.maxError)
        }
    }
}
