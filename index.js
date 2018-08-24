const fs = require('fs');

function tailf(filepath) {
    const CHUNK_SIZE = 16 * 1024;
    const DELAY = 1000;
    const fd = fs.openSync(filepath, 'r');
    let cursor = 0;
    const loop = () => {
        let buf = Buffer.alloc(CHUNK_SIZE);
        let content = fs.readSync(fd, buf, 0, CHUNK_SIZE, cursor);
        cursor += content;
        process.stdout.write(buf.slice(0, content));

        if (content < CHUNK_SIZE) {
            setTimeout(() => {
                loop();
            }, DELAY);
        } else {
            loop();
        }
    };

    loop();
}

if (require.main === module) {
    tailf(process.argv.slice(2)[0]);
} else {
    module.exports = tailf;
}