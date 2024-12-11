import { DawnOfSynthesis } from './dawn_of_synthesis.js';

class QuantumTerminal {
    constructor() {
        this.term = new Terminal({
            cursorBlink: true,
            convertEol: true,
            cols: 80,
            rows: 24,
            fontSize: 16,
            fontFamily: "'Courier New', 'Consolas', monospace",
            theme: {
                background: '#000000',
                foreground: '#e0e0e0',
                cursor: '#00ffff',
                cursorAccent: '#003333',
                selection: 'rgba(0, 255, 255, 0.3)'
            }
        });
        this.currentLine = '';
        this.resolveInput = null;
    }

    async initialize() {
        this.term.open(document.getElementById('terminal'));
        
        // Handle input
        this.term.onData(data => {
            if (data === '\r') {  // Enter key
                this.term.write('\r\n');
                if (this.resolveInput) {
                    this.resolveInput(this.currentLine);
                    this.currentLine = '';
                }
            } else if (data === '\u007f') {  // Backspace
                if (this.currentLine.length > 0) {
                    this.currentLine = this.currentLine.slice(0, -1);
                    this.term.write('\b \b');  // Move back, write space, move back
                }
            } else {
                this.currentLine += data;
                this.term.write(data);
            }
        });

        // Run our Dawn of Synthesis experience
        await this.runDemo();
    }

    async input(prompt = '') {
        this.term.write(prompt);
        return new Promise(resolve => {
            this.resolveInput = resolve;
        });
    }

    print(text) {
        this.term.writeln(text);
    }

    async typewriterPrint(text, delay = 20) {
        for (const char of text) {
            this.term.write(char);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        this.term.write('\r\n');
    }

    async runDemo() {
        // Initialize Dawn of Synthesis
        const dawn = new DawnOfSynthesis(this);
        await dawn.start();
    }
}

// Initialize when page loads
window.addEventListener('load', async () => {
    const terminal = new QuantumTerminal();
    await terminal.initialize();
});
