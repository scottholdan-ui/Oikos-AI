/**
 * Base Agent Class
 * Foundation for all specialized AI agents in the Oikos-AI system
 */

export interface AgentConfig {
  name: string;
  role: string;
  model?: string;
}

export interface AgentOutput {
  agentName: string;
  timestamp: Date;
  content: any;
  status: 'success' | 'error' | 'pending';
}

export abstract class BaseAgent {
  protected name: string;
  protected role: string;
  protected model: string;
  protected context: Record<string, any> = {};

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.role = config.role;
    this.model = config.model || 'gpt-4';
  }

  /**
   * Set context from previous agent outputs
   */
  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Get current context
   */
  getContext(): Record<string, any> {
    return this.context;
  }

  /**
   * Execute agent's primary task - to be implemented by subclasses
   */
  abstract execute(input: string): Promise<AgentOutput>;

  /**
   * Validate input
   */
  protected validateInput(input: string): boolean {
    return input && input.trim().length > 0;
  }

  /**
   * Format output
   */
  protected formatOutput(content: any, status: 'success' | 'error' = 'success'): AgentOutput {
    return {
      agentName: this.name,
      timestamp: new Date(),
      content,
      status,
    };
  }

  /**
   * Get agent info
   */
  getInfo() {
    return {
      name: this.name,
      role: this.role,
      model: this.model,
    };
  }
}
