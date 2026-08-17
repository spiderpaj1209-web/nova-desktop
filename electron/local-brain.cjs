const fs = require('node:fs/promises');
const path = require('node:path');

class LocalBrain {
  constructor({ userDataPath, model = process.env.NOVA_MODEL || 'llama3.2:3b', endpoint = process.env.NOVA_OLLAMA_URL || 'http://127.0.0.1:11434/api/chat' }) {
    this.userDataPath = userDataPath;
    this.model = model;
    this.endpoint = endpoint;
    this.state = 'stopped';
    this.history = [];
  }

  get memoryPath() {
    return path.join(this.userDataPath, 'nova', 'memory.json');
  }

  status() {
    return { state: this.state, model: this.model, localOnly: true, messageCount: this.history.length };
  }

  async start() {
    this.state = 'starting';
    await fs.mkdir(path.dirname(this.memoryPath), { recursive: true });
    try {
      this.history = JSON.parse(await fs.readFile(this.memoryPath, 'utf8'));
      if (!Array.isArray(this.history)) this.history = [];
    } catch {
      this.history = [];
    }
    this.state = 'ready';
    return this.status();
  }

  async stop() {
    this.state = 'stopped';
    await this.saveMemory();
    return this.status();
  }

  async ask(text) {
    if (this.state === 'stopped') await this.start();
    const content = String(text || '').trim();
    if (!content) throw new Error('Le message pour Nova est vide.');

    this.state = 'thinking';
    this.history.push({ role: 'user', content, at: new Date().toISOString() });
    const messages = [
      { role: 'system', content: 'Tu es Nova, un assistant local Windows. Réponds en français, de façon utile et concise. Ne prétends jamais avoir effectué une action que tu n’as pas faite.' },
      ...this.history.slice(-20).map(({ role, content: item }) => ({ role, content: item }))
    ];

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model: this.model, messages, stream: false })
      });
      if (!response.ok) throw new Error(`Le moteur local a répondu ${response.status}.`);
      const body = await response.json();
      const answer = body?.message?.content?.trim();
      if (!answer) throw new Error('Le moteur local n’a pas fourni de réponse.');
      this.history.push({ role: 'assistant', content: answer, at: new Date().toISOString() });
      await this.saveMemory();
      this.state = 'ready';
      return { answer, status: this.status() };
    } catch (error) {
      this.state = 'error';
      await this.saveMemory();
      return {
        answer: `Le cerveau local n’est pas encore disponible : ${error.message}`,
        status: this.status(),
        error: error.message
      };
    }
  }

  async saveMemory() {
    await fs.mkdir(path.dirname(this.memoryPath), { recursive: true });
    await fs.writeFile(this.memoryPath, JSON.stringify(this.history.slice(-200), null, 2), 'utf8');
  }
}

module.exports = { LocalBrain };
