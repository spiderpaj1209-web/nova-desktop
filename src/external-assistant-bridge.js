export class ExternalAssistantBridge {
  constructor() {
    this.active = false;
    this.messages = [];
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  snapshot() {
    return { active: this.active, messages: [...this.messages] };
  }

  emit() {
    const state = this.snapshot();
    this.listeners.forEach((listener) => listener(state));
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.addSystemMessage("Pont local activé. Configurez un fournisseur autorisé avant tout échange externe.");
    this.emit();
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.addSystemMessage("Pont arrêté par l’utilisateur.");
    this.emit();
  }

  addSystemMessage(content) {
    this.messages.push({ id: crypto.randomUUID(), role: "system", content, createdAt: new Date().toISOString() });
  }

  addMessage(role, content) {
    if (!this.active || !content?.trim()) return;
    this.messages.push({ id: crypto.randomUUID(), role, content: content.trim(), createdAt: new Date().toISOString() });
    this.emit();
  }
}

export const externalAssistantBridge = new ExternalAssistantBridge();
