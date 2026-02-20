class GeminiCommandCenter {
    constructor() {
        this.currentMode = 'text';
        this.files = {
            image: null,
            document: null,
            audio: null
        };
        
        this.init();
    }
    
    init() {
        this.bindModeSelector();
        this.bindFileInputs();
        this.bindGenerateButton();
        this.bindCopyButton();
        this.bindKeyboardShortcuts();
    }
    
    bindModeSelector() {
        const modeBtns = document.querySelectorAll('.mode-btn');
        
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.switchMode(mode);
            });
        });
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        document.querySelectorAll('.mode-content').forEach(content => {
            content.classList.toggle('active', content.id === `${mode}-mode`);
        });
    }
    
    bindFileInputs() {
        this.bindDropZone('image-drop', 'image-input', 'image-preview', 'image', 'image/*');
        this.bindDropZone('doc-drop', 'doc-input', 'doc-preview', 'document', '.pdf,.txt,.doc,.docx');
        this.bindDropZone('audio-drop', 'audio-input', 'audio-preview', 'audio', 'audio/*');
    }
    
    bindDropZone(zoneId, inputId, previewId, fileKey, accept) {
        const zone = document.getElementById(zoneId);
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        if (!zone || !input) return;
        
        zone.addEventListener('click', () => input.click());
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleFile(file, preview, fileKey);
        });
        
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) this.handleFile(file, preview, fileKey);
        });
    }
    
    handleFile(file, previewEl, fileKey) {
        this.files[fileKey] = file;
        
        previewEl.classList.add('active');
        
        if (fileKey === 'image') {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewEl.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            const size = (file.size / 1024).toFixed(1);
            previewEl.innerHTML = `<span class="file-info">${file.name} (${size} KB)</span>`;
        }
    }
    
    bindGenerateButton() {
        const btn = document.getElementById('generate-btn');
        
        btn.addEventListener('click', async () => {
            await this.generate();
        });
    }
    
    async generate() {
        const btn = document.getElementById('generate-btn');
        const output = document.getElementById('output');
        const tokenCount = document.getElementById('token-count');
        const timeTaken = document.getElementById('time-taken');
        
        btn.classList.add('loading');
        btn.innerHTML = '<span class="btn-text">PROCESSING</span><span class="btn-icon">◈</span>';
        
        const startTime = performance.now();
        
        try {
            let endpoint = '/generate-text';
            let formData = new FormData();
            
            switch (this.currentMode) {
                case 'text':
                    const textPrompt = document.getElementById('text-prompt').value;
                    if (!textPrompt.trim()) {
                        throw new Error('Please enter a prompt');
                    }
                    endpoint = '/generate-text';
                    formData.append('prompt', textPrompt);
                    break;
                    
                case 'image':
                    if (!this.files.image) {
                        throw new Error('Please upload an image');
                    }
                    endpoint = '/generate-from-image';
                    formData.append('image', this.files.image);
                    formData.append('prompt', document.getElementById('image-prompt').value || 'Describe this image');
                    break;
                    
                case 'document':
                    if (!this.files.document) {
                        throw new Error('Please upload a document');
                    }
                    endpoint = '/generate-from-document';
                    formData.append('document', this.files.document);
                    formData.append('prompt', document.getElementById('doc-prompt').value || 'Please analyze and summarize this document');
                    break;
                    
                case 'audio':
                    if (!this.files.audio) {
                        throw new Error('Please upload an audio file');
                    }
                    endpoint = '/generate-from-audio';
                    formData.append('audio', this.files.audio);
                    formData.append('prompt', document.getElementById('audio-prompt').value || 'Please transcribe this audio');
                    break;
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            const endTime = performance.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            
            if (result.success) {
                output.innerHTML = this.formatOutput(result.text);
                timeTaken.textContent = `Time: ${duration}s`;
            } else {
                output.innerHTML = `<span style="color: #e74c3c;">Error: ${result.error}</span>`;
                timeTaken.textContent = '';
                tokenCount.textContent = '';
            }
            
        } catch (error) {
            output.innerHTML = `<span style="color: #e74c3c;">Error: ${error.message}</span>`;
            timeTaken.textContent = '';
            tokenCount.textContent = '';
        } finally {
            btn.classList.remove('loading');
            btn.innerHTML = '<span class="btn-text">EXECUTE</span><span class="btn-icon">→</span>';
        }
    }
    
    formatOutput(text) {
        return text
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
    
    bindCopyButton() {
        const copyBtn = document.getElementById('copy-btn');
        
        copyBtn.addEventListener('click', async () => {
            const output = document.getElementById('output');
            const text = output.textContent;
            
            if (text && text !== 'Awaiting input command...') {
                await navigator.clipboard.writeText(text);
                
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '<span>✓</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = original;
                }, 2000);
            }
        });
    }
    
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                this.generate();
            }
            
            if (e.key >= '1' && e.key <= '4' && !e.target.matches('textarea, input')) {
                const modes = ['text', 'image', 'document', 'audio'];
                this.switchMode(modes[parseInt(e.key) - 1]);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GeminiCommandCenter();
});
