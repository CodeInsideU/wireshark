const { exec } = require('child_process');

async function capturePackets(interface) {
    return new Promise(async (resolve, reject) => {
        const command = `tshark -i ${interface} -l -T fields -e frame.time -e eth.src -e eth.dst -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e data`;
        const child = exec(command);

        child.stdout.on('data', (data) => {
            // Parse and display Ethernet packet data
            const [timestamp, ethSrc, ethDst, ipSrc, ipDst, srcPort, dstPort, packetData] = data.split('\t');
            console.log('Timestamp:', timestamp);
            console.log('Ethernet Source:', ethSrc);
            console.log('Ethernet Destination:', ethDst);
            console.log('IP Source:', ipSrc);
            console.log('IP Destination:', ipDst);
            console.log('Source Port:', srcPort);
            console.log('Destination Port:', dstPort);
            console.log('Packet Data:', packetData);
            console.log('\n');
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

module.exports = {
    capturePackets,
};
