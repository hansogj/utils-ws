const dependencies = () => {

    const template = ([key, val]) => `<li>
    <a href="https://www.npmjs.com/package/${key}"
    >${key}@v${val}</a
    >
    </li>`
    const ul = document.querySelector("[data-ul]");
    Array.from(
        document.querySelectorAll("[data-dependencies]")
    )
        .map((e) => e.textContent)
        .map(JSON.parse)
        .flatMap(Object.entries)
        .map(template)
        .map((templ) => new DOMParser().parseFromString(templ, 'text/html'))
        .map(it => it.body.childNodes[0])
        .map(el => ul.appendChild(el));
}
try {
    module.exports.dependencies = dependencies
} catch {
    window.dependencies = dependencies;
}