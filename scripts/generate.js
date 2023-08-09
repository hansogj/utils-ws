const { execSync } = require('child_process');
const fs = require('fs');

const scope = '@hansogj';

const placeHolder = '[//]: <> (package-list-placeholder-do-not-remove)';

const toWs = (...args) => ['./packages', ...args].join('/');

const configurePackage = (newPackName) => {
    const raw = fs.readFileSync(toWs(newPackName, 'package.json'));
    let config = JSON.parse(raw);

    config = {
        ...config,
        ...{
            version: '0.0.1',
            files: ['src'],
            main: 'src/index.ts',
            scripts: {
                ...config.scripts,
                ...{
                    build: 'rm -rf dist/* && tsc -p tsconfig.pkg.json',
                    clean: 'rm -rf dist node_modules coverage *.tgz',
                    prepack: 'npm run build',
                    ts: 'tsc --noEmit -p tsconfig.pkg.json',
                },
            },
        },
    };
    fs.writeFileSync(toWs(newPackName, `package.json`), JSON.stringify(config, null, 4));
};

const mdLinkToPackage = (newPackName) => `[${newPackName}](${toWs(newPackName, 'README.md')})`;

const updateMainReadme = (newPackName) => {
    const readme = fs.readFileSync('./README.md', { encoding: 'utf8', flag: 'r' });
    fs.writeFileSync(
        './README.md',
        readme.replace(`\n${placeHolder}`, [`- ${mdLinkToPackage(newPackName)}`, '', placeHolder].join(`\n`)),
    );
};

const copyFiles = (files, target) => files.map((file) => fs.copyFileSync(`${__dirname}/${file}`, `${target}/${file}`));

const generate = (newPackName) => {
    if (!newPackName) {
        process.exit();
    } else {
        console.log(`Creating new package: ${newPackName} `);
        const newPackPath = `./packages/${newPackName}`;

        execSync(`npm init --scope=${scope} -y -w ${newPackPath}`);
        configurePackage(newPackName);
        copyFiles(['.npmignore', 'tsconfig.pkg.json'], newPackPath);
        fs.writeFileSync(`${newPackPath}/README.md`, `# ${newPackName.toUpperCase()}`);
        fs.mkdirSync(`${newPackPath}/src`);
        copyFiles(['index.ts'], `${newPackPath}/src`);
        updateMainReadme(newPackName);
        console.log(execSync(`ls -la ${toWs(newPackName)}`).toString());
    }
};

generate(process.argv.slice(2).shift());
