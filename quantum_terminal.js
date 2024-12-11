import { DawnOfSynthesis } from './dawn_of_synthesis.js';

class QuantumTerminal {
    constructor() {
        this.calculateDimensions();
        const fontSize = this.calculateFontSize();
        this.term = new Terminal({
            cursorBlink: true,
            convertEol: true,
            fontSize: fontSize,
            fontFamily: "'Courier New', 'Consolas', monospace",
            cols: this.cols,
            rows: this.rows,
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

    calculateFontSize() {
        if (window.innerWidth <= 480) {  // Mobile
            return 20;
        } else if (window.innerWidth <= 768) {  // Tablet
            return 18;
        } else {  // Desktop
            return 16;
        }
    }

    calculateDimensions() {
        // Get container size (accounting for padding)
        const terminalContainer = document.getElementById('terminal');
        const containerStyle = window.getComputedStyle(terminalContainer);
        const paddingH = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
        const paddingV = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
        
        const availableWidth = terminalContainer.clientWidth - paddingH;
        const availableHeight = terminalContainer.clientHeight - paddingV;

        const fontSize = this.calculateFontSize();
        const charWidth = fontSize * 0.6;
        const charHeight = fontSize * 1.2;

        this.cols = Math.floor(availableWidth / charWidth);
        this.rows = Math.floor(availableHeight / charHeight);

        // Adjust column bounds based on screen size
        const minCols = window.innerWidth <= 480 ? 30 : 40;
        const maxCols = window.innerWidth <= 480 ? 40 : 100;

        // Ensure minimum reasonable size
        this.cols = Math.max(minCols, Math.min(this.cols, maxCols));
        this.rows = Math.max(10, Math.min(this.rows, 30));
    }

    async initialize() {
        this.term.open(document.getElementById('terminal'));
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const fontSize = this.calculateFontSize();
            this.term.options.fontSize = fontSize;
            this.calculateDimensions();
            this.term.resize(this.cols, this.rows);
        });

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
