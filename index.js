const fs = require('fs');
const { promisify } = require('util');

const OpenFileSync = promisify(fs.open);
const fileStatSync = promisify(fs.fstat);
const readSync = promisify(fs.read);

async function tailf(filepath) {
    const CHUNK_SIZE = 16 * 1024;

    const fd = await OpenFileSync(filepath, 'r');
    let { size: cursor } = await fileStatSync(fd);

    const loop = async () => {
        let buf = Buffer.alloc(CHUNK_SIZE);
        let { bytesRead, buffer } = await readSync(fd, buf, 0, CHUNK_SIZE, cursor);
        cursor += bytesRead;
        process.stdout.write(buf.slice(0, bytesRead));

        if (bytesRead < CHUNK_SIZE) {
            // nothing
        } else {
            loop();
        }
    };

    fs.watch(filepath, (event, filename) => {
        if (event === 'change') {
            loop();
        }
    });

    loop();
}

if (require.main === module) {
    tailf(process.argv.slice(2)[0]);
} else {
    module.exports = tailf;
}