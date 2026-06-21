
const shouldIt = require('./should-it');

const shared = {
    verify: require('./verify').verify,
    suite: require('./test.suite').suite,
    html: require('./test.suite').html,
    dependencies: require('./dependencies').dependencies,
    versions: require('./deps.json'),
    might: shouldIt.might,
    createShouldIt: shouldIt.createShouldIt,
    shouldIt: shouldIt.shouldIt,
}

try {
    module.exports = shared

} catch (e) {
    console.error("Not able to load shared lib", e)
}
