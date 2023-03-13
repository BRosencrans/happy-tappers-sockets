const generateId = () => {
    const a = 65;
    const z = 90;

    const code = "";
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    for (let i = 0; i < 4; i++) {
        code = code + String.fromCharCode(getRandomInt(a, z));
    }
    console.log(code);
    return code;
};

module.exports = { generateId };

//TODO: to be deleted since we are letting players create their own room code.
