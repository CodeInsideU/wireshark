const { capturePackets } = require('./wireshark');

async function main() {
    try {

        await capturePackets('Wi-Fi');
    } catch (error) {
        console.error(error.message);
    }
}

main();
