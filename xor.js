class XOR {
    data = [
        [[0,0], [0,0]],
        [[1,0], [1,0]],
        [[0,1], [1,0]],
        [[1,1], [0,0]],
    ]

    static random_input() {
        let in1 = Math.round(Math.random())
        let in2 = Math.round(Math.random())

        return [in1,in2]
    }

    static train_rand(thing, threshold=0.2) {
        let ins = XOR.random_input()
        let out = (ins[0] == ins[1]) ? 0 : 1
        let outs = [out, 0]

        console.log(ins, outs)

        while (thing.maxError > threshold){
            thing.input = ins
            thing.expected = outs
        }
    }

    static train(thing) {
        for (let I of data) {
            console.log(data[0],data[1])
            thing.input = data[0]
            thing.expected = data[1]
        }
    }

    static test(thing) {
        for (let D of data) {
            thing.input = D[0]
        }
    }
}