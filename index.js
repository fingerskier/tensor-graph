let dim = {X:5, Y:3, Z:4}
let T = new Tensor({dimension:dim})

window.onload = function() {
    // draw inputs
    let inputs = document.getElementById('inputs')

    for (let Y=0; Y < dim.Y; Y++) {
        let node = document.createElement('label')
        let input = document.createElement('input')
        let input_id = `input-${Y}`

        node.setAttribute('for', input_id)
        input.setAttribute('id', input_id)
        input.setAttribute('value', T.state(0,Y,0))

        node.appendChild(input)
        inputs.appendChild(node)
    }

    // draw expects
    let expects = document.getElementById('expects')

    for (let Y=0; Y < dim.Y; Y++) {
        let node = document.createElement('label')
        let input = document.createElement('input')
        let input_id = `expect-${Y}`

        node.setAttribute('for', input_id)
        input.setAttribute('id', input_id)
        input.setAttribute('value', T._expected[Y])

        node.appendChild(input)
        expects.appendChild(node)
    }

    draw_tensor()
    
    
    T.input = [.1, .2, .3]
    
    console.log(`Output = ${T.output}`)
    
    T.expected = [.25, .35, .45]
    
    T.train(0.1)
    
    console.log(`Output = ${T.output}`)    
}

function draw_tensor() {
    let errorer = document.getElementById('error')
    let main = document.getElementById('main')
    let tensor = document.getElementById('tensor')

    tensor.outerHTML = ""

    tensor = document.createElement('div')
    tensor.setAttribute('id', 'tensor')

    for (let Z=0; Z < dim.Z; Z++) {
        let table = document.createElement('table')
        let header = document.createElement('div')

        header.textContent = `Layer ${Z}`

        for (let Y=0; Y < dim.Y; Y++) {
            let row = document.createElement('tr')
            
            for (let X=0; X < dim.X; X++) {
                let cell = document.createElement('td')

                cell.textContent = Math.trunc(T.state(X,Y,Z)*100)/100 //`${X},${Y},${Z}`

                row.appendChild(cell)
            }

            table.appendChild(row)
        }

        tensor.appendChild(header)
        tensor.appendChild(table)
    }

    main.appendChild(tensor)

    errorer.textContent = `Max Error = ${T.maxError}`
}

function handle_activation(event) {
    let inputs = document.querySelectorAll("#inputs input")
    let input_values = []

    for (let I=0; I < inputs.length; I++) {
        input_values.push(+inputs[I].value)
    }

    T.input = input_values

    draw_tensor()
}

function handle_inputs(event) {
    let expects = document.querySelectorAll("#expects input")
    let inputs = document.querySelectorAll("#inputs input")
    let input_values = []
    let expected_values = []

    for (let I=0; I < inputs.length; I++) {
        input_values.push(+inputs[I].value)
    }

    for (let I=0; I < expects.length; I++) {
        expected_values.push(+expects[I].value)
    }

    T.input = input_values
    T.expected = expected_values

    draw_tensor()
}

function handle_load(event) {
    let inputs = document.querySelectorAll("#inputs input")

    T._state = window.localStorage.getItem('tensor').split(',').map(val=>{return +val})

    for (let I=0; I < inputs.length; I++) {
        inputs[I].value = T.layer(0)[I]
    }

    draw_tensor()
}

function handle_save(event) {
    window.localStorage.setItem('tensor', T._state)
}
