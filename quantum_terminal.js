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
        
        // Create a clean namespace for our Python code
        const namespace = this.pyodide.globals.get("dict")();
        
        // Set up stdout and stdin
        const terminalIO = {
            stdout: {
                write: (text) => {
                    console.log("stdout.write called with:", text);
                    if (text instanceof Uint8Array) {
                        text = new TextDecoder().decode(text);
                    }
                    console.log("writing to terminal:", text);
                    this.term.write(text);
                    return text.length;
                },
                flush: () => {
                    console.log("stdout.flush called");
                    this.term.write('\n');
                }
            },
            stdin: {
                buffer: "",
                pendingResolve: null,
                read: function() {
                    console.log('stdin.read() called, buffer:', this.buffer);
                    return new Promise((resolve) => {
                        if (this.buffer.length > 0) {
                            const char = this.buffer[0];
                            this.buffer = this.buffer.slice(1);
                            console.log('resolving immediately with:', char);
                            resolve(char);
                        } else {
                            console.log('no data, storing resolve for later');
                            this.pendingResolve = resolve;
                            console.log('pendingResolve stored as:', this.pendingResolve);
                        }
                    });
                },
                isEOF: function() {
                    console.log('isEOF check called');
                    return false;  // Let's never EOF for now
                }
            }
        };

        this.pyodide.setStdin(terminalIO.stdin);
        this.pyodide.setStdout(terminalIO.stdout);
        this.pyodide.setStderr(terminalIO.stdout);

        // Set up input handling
        this.term.onData(data => {
            console.log('onData fired with:', data, 'current buffer:', terminalIO.stdin.buffer);
            terminalIO.stdin.buffer += data;
            console.log('buffer after append:', terminalIO.stdin.buffer);
            if (terminalIO.stdin.pendingResolve) {
                const char = terminalIO.stdin.buffer[0];
                terminalIO.stdin.buffer = terminalIO.stdin.buffer.slice(1);
                console.log('resolving pending promise with:', char);
                terminalIO.stdin.pendingResolve(char);
                terminalIO.stdin.pendingResolve = null;
            }
        });

        // Load dawn_of_synthesis.py
        try {
            const response = await fetch('test_io.py');
            const content = await response.text();
            
            // Run in our clean namespace
            await this.pyodide.runPython(content, {globals: namespace});
            await this.pyodide.runPython('main()', {globals: namespace});
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
