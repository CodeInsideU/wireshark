const chai = require('chai');
const expect = chai.expect;
const { capturePackets, stopCapture } = require('./wireshark.js'); // Replace with the actual path to your package module

describe('Packet Capture (Original Code)', () => {
    let captureProcess;

    beforeEach(() => {
        // Start the packet capture using the original code before each test
        captureProcess = capturePackets('Wi-Fi');
    });

    afterEach(async () => {
        // Stop the packet capture after each test
        await stopCapture();
    });

    it('should capture packets', async function () {
        this.timeout(0); // Disable the timeout for this test
        // The test will run indefinitely until you manually stop the terminal.
        const result = await captureProcess;
        expect(result).to.equal('Packet capture completed');
    });

    // Add more test cases as needed
});
