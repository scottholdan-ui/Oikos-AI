/**
 * LLM Service
 * Unified interface for all AI provider integrations
 */

import axios from 'axios';

export interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  timestamp: Date;
}

export interface LLMConfig {
  provider: 'openai' | 'claude' | 'gemini';
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export class LLMService {
  private openaiKey: string;
  private claudeKey: string;
  private geminiKey: string;
  private defaultConfig: LLMConfig = {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
  };

  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY || '';
    this.claudeKey = process.env.ANTHROPIC_API_KEY || '';
    this.geminiKey = process.env.GEMINI_API_KEY || '';
  }

  /**
   * Call OpenAI GPT models
   */
  async callOpenAI(
    messages: Array<{ role: string; content: string }>,
    config: Partial<LLMConfig> = {}
  ): Promise<LLMResponse> {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (!this.openaiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: finalConfig.model || 'gpt-4',
          messages,
          temperature: finalConfig.temperature,
          max_tokens: finalConfig.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.choices[0].message.content,
        provider: 'openai',
        model: finalConfig.model || 'gpt-4',
        tokensUsed: response.data.usage.total_tokens,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error}`);
    }
  }

  /**
   * Call Anthropic Claude models
   */
  async callClaude(
    messages: Array<{ role: string; content: string }>,
    config: Partial<LLMConfig> = {}
  ): Promise<LLMResponse> {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (!this.claudeKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: finalConfig.model || 'claude-3-opus-20240229',
          max_tokens: finalConfig.maxTokens,
          messages,
          temperature: finalConfig.temperature,
        },
        {
          headers: {
            'x-api-key': this.claudeKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.content[0].text,
        provider: 'claude',
        model: finalConfig.model || 'claude-3-opus-20240229',
        tokensUsed: response.data.usage.input_tokens + response.data.usage.output_tokens,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`Claude API error: ${error}`);
    }
  }

  /**
   * Call Google Gemini models
   */
  async callGemini(
    messages: Array<{ role: string; content: string }>,
    config: Partial<LLMConfig> = {}
  ): Promise<LLMResponse> {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (!this.geminiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${finalConfig.model || 'gemini-pro'}:generateContent`,
        {
          contents: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: finalConfig.temperature,
            maxOutputTokens: finalConfig.maxTokens,
          },
        },
        {
          params: {
            key: this.geminiKey,
          },
        }
      );

      return {
        content: response.data.candidates[0].content.parts[0].text,
        provider: 'gemini',
        model: finalConfig.model || 'gemini-pro',
        tokensUsed: 0, // Gemini doesn't return token count in this format
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`Gemini API error: ${error}`);
    }
  }

  /**
   * Intelligent routing - choose best provider for task
   */
  async callBestProvider(
    messages: Array<{ role: string; content: string }>,
    config: Partial<LLMConfig> = {}
  ): Promise<LLMResponse> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const provider = finalConfig.provider || 'openai';

    switch (provider) {
      case 'claude':
        return this.callClaude(messages, finalConfig);
      case 'gemini':
        return this.callGemini(messages, finalConfig);
      case 'openai':
      default:
        return this.callOpenAI(messages, finalConfig);
    }
  }

  /**
   * Generate and parse structured JSON from LLM
   */
  async generateJSON<T = any>(
    prompt: string,
    schema: string,
    config: Partial<LLMConfig> = {}
  ): Promise<T> {
    const response = await this.callBestProvider(
      [
        {
          role: 'system',
          content: `You are a JSON generator. Output ONLY valid JSON that matches this schema:\n${schema}\n\nNever include markdown formatting like \`\`\`json`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      config
    );

    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse JSON response:', response.content);
      throw new Error('LLM response is not valid JSON');
    }
  }

  /**
   * Generate code with specified language
   */
  async generateCode(
    prompt: string,
    language: 'typescript' | 'python' | 'javascript' | 'sql' = 'typescript',
    config: Partial<LLMConfig> = {}
  ): Promise<string> {
    const response = await this.callBestProvider(
      [
        {
          role: 'system',
          content: `You are an expert ${language} developer. Generate production-ready code. Output ONLY code without markdown formatting.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      config
    );

    return response.content;
  }

  /**
   * Generate with streaming (for long responses)
   */
  async generateStream(
    prompt: string,
    onChunk: (chunk: string) => void,
    config: Partial<LLMConfig> = {}
  ): Promise<void> {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (finalConfig.provider === 'openai') {
      // Streaming for OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiKey}`,
          },
          responseType: 'stream',
        }
      );

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');
        lines.forEach((line: string) => {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0].delta.content;
              if (content) onChunk(content);
            } catch (e) {
              // Parse error, skip
            }
          }
        });
      });
    }
  }

  /**
   * Validate generated code
   */
  async validateCode(code: string, language: string): Promise<{ valid: boolean; issues: string[] }> {
    const response = await this.callBestProvider(
      [
        {
          role: 'system',
          content: `You are a code validator. Analyze the ${language} code and list any issues. Output JSON format: {"valid": boolean, "issues": string[]}`,
        },
        {
          role: 'user',
          content: `Validate this code:\n${code}`,
        },
      ],
      { provider: 'openai', model: 'gpt-4' }
    );

    try {
      return JSON.parse(response.content);
    } catch {
      return { valid: false, issues: ['Failed to validate code'] };
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): Record<string, string[]> {
    return {
      openai: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'],
      claude: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      gemini: ['gemini-pro', 'gemini-pro-vision'],
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
