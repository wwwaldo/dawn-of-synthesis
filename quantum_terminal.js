class QuantumTerminal {
    constructor() {
        this.term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#000',
                foreground: '#fff',
                cursor: '#fff',
            }
        });
        this.pyodide = null;
        this.currentLine = '';
        this.prompt = '>>> ';
    }

    async initialize() {
        // Initialize terminal
        this.term.open(document.getElementById('terminal'));
        this.term.writeln('Initializing quantum terminal...');
        
        // Load Pyodide
        this.term.writeln('Loading Python runtime...');
        this.pyodide = await loadPyodide();
        
        // Set up stdout only
        const terminalIO = {
            stdout: {
                write: (text) => {
                    if (text instanceof Uint8Array) {
                        text = new TextDecoder().decode(text);
                    }
                    this.term.write(text);
                    return text.length;
                },
                flush: () => {}
            }
        };

        this.pyodide.setStdout(terminalIO.stdout);
        this.pyodide.setStderr(terminalIO.stdout);
        
        // Load dawn_of_synthesis.py
        try {
            const response = await fetch('dawn_of_synthesis.py');
            const content = await response.text();
            await this.pyodide.runPython(content);
            await this.pyodide.runPython('main()');
        } catch (err) {
            console.error(err);
            this.term.writeln('Warning: Could not load synthesis protocols');
        }

        this.term.writeln('Type run_synthesis() to initiate quantum protocols');
    }
}

// Initialize when page loads
window.addEventListener('load', async () => {
    const terminal = new QuantumTerminal();
    await terminal.initialize();
});
