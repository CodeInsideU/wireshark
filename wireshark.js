const { spawn } = require('child_process');
const fs = require('fs');

let childProcess;

async function capturePackets(interface) {
    return new Promise((resolve, reject) => {
        const command = `tshark`;
        const args = [
            '-i',
            interface,
            '-l',
            '-T',
            'fields',
            '-e',
            'frame.time',
            '-e',
            'eth.src',
            '-e',
            'eth.dst',
            '-e',
            'ip.src',
            '-e',
            'ip.dst',
            '-e',
            'tcp.srcport',
            '-e',
            'tcp.dstport',
            '-e',
            'data',
        ];

        const child = spawn(command, args);
        childProcess = child;

        const logFile = fs.createWriteStream('packet_log.txt', { flags: 'a' }); // Append mode

        child.stdout.pipe(logFile);
        child.stderr.pipe(process.stderr); // Redirect stderr to the console for error output.

        child.stdout.on('data', (data) => {
            const lines = data.toString().split('\n').filter(line => line.trim() !== ''); // Split lines and filter out empty lines

            for (const line of lines) {
                const [timestamp, ethSrc, ethDst, ipSrc, ipDst, srcPort, dstPort, packetData] = line.split('\t');
                console.log('Timestamp:', timestamp);
                console.log('Ethernet Source:', ethSrc);
                console.log('Ethernet Destination:', ethDst);
                console.log('IP Source:', ipSrc);
                console.log('IP Destination:', ipDst);
                console.log('Source Port:', srcPort);
                console.log('Destination Port:', dstPort);

                if (packetData) {
                    console.log('Packet Data:', packetData);
                }

                console.log('\n');

                if (packetData) {
                    logFile.write(`${timestamp}\t${ethSrc}\t${ethDst}\t${ipSrc}\t${ipDst}\t${srcPort}\t${dstPort}\t${packetData}\n`);
                }
            }
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve('Packet capture completed');
            } else {
                reject(`Packet capture failed with code ${code}`);
            }
        });

        child.on('error', (error) => {
            reject(`Error capturing packets: ${error.message}`);
        });
    });
}

async function stopCapture() {
    if (childProcess) {
        childProcess.kill();
        childProcess = null; // Reset the child process variable
    }
}

process.on('SIGINT', () => {
    stopCapture();
    process.exit();
});

module.exports = {
    capturePackets,
    stopCapture,
};
