let demofunction;
let  a = 9;

function init() {
    let a = 5;
    demofunction = function() {
        console.log(a);
    };
};

init();

demofunction();