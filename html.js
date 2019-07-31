function attributes(attr) {
    let result = []

    for (let X in attr) {
        result.push(`${X}="${attr[X]}"`)
    }

    return result.join(' ')
}

function tr(innards, attr={}) {
    return `<tr ${this.attributes(attr)}>${innards}</tr>`
}

function td(innards, attr={}) {
    return `<td ${this.attributes(attr)}>${innards}</td>`
}

function button(innards, attr={}) {
    return `<button ${this.attributes(attr)}>${innards}</button>`
}
