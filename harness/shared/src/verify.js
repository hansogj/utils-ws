
const prettyPrint = (val, spaces = 0) => typeof val === "object" ? JSON.stringify(val, null, spaces) : val;
const formatSuccess = (title, actual) => `> "${prettyPrint(title)}" ran successfully:  ${prettyPrint(actual)}`;
const formatFails = (title, actual, expectation) => `!!!> ${title} ran with error \nexpected: \n\t ${prettyPrint(actual, 8)} \n\n to equal ${prettyPrint(expectation, 8)}`


const verify = (title, test) => {

    const area = document.querySelector("#verification");
    const pre = document.createElement("pre");
    const actual = test();
    try {
        JSON.stringify(test());
    } catch (error) {
        actual = `${error.stack}`;
    }


    return {
        toEqual: (expectation) => {
            if (JSON.stringify(expectation) === JSON.stringify(actual)) {
                pre.classList.add("success");
                pre.innerText = formatSuccess(title, actual);
            } else {
                pre.classList.add("error");
                pre.innerText = formatFails(title, actual, expectation);
            }
            area.appendChild(pre);
        },
        toDiffer: (expectation) => {
            if (JSON.stringify(expectation) !== actual) {
                pre.classList.add("success");
                pre.innerText = formatSuccess(title, actual);
            } else {
                pre.classList.add("error");
                pre.innerText = formatFails(title, actual, expectation);
            }
            area.appendChild(pre);
        }
    };
};

try {
    module.exports.verify = verify
} catch {
    window.verify = verify;
}