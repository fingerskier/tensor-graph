vector = {
    add: function(A, B) {
        return A.map((a,b)=>{return a+b})
    },
    subtract: function(A, B) {
        return A.map((a,b)=>{return a-b})
    },
    multiply: function(A, B) {
        return A.map((a,b)=>{return a*b})
    },
    scale: function(A, S) {
        return A.map((a,b)=>{return a*S})
    },
}