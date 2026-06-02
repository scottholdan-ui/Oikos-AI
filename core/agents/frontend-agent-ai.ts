/**
 * Updated Frontend Agent with AI Code Generation
 * Generates actual React components using GPT-4
 */

import { BaseAgent, AgentOutput, AgentConfig } from './base-agent';
import { llmService } from '../services/llm-service';
import { codeValidator } from '../services/code-validator';

export interface ComponentCode {
  name: string;
  path: string;
  code: string;
  dependencies: string[];
  tests?: string;
}

export interface FrontendStructure {
  projectName: string;
  components: ComponentCode[];
  pages: ComponentCode[];
  hooks: ComponentCode[];
}

export class FrontendAgentAI extends BaseAgent {
  private llmService = llmService;
  private codeValidator = codeValidator;

  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'Frontend Agent',
      role: 'Generates production-ready React components using AI',
      ...config,
    });
  }

  /**
   * Execute AI-powered frontend generation
   */
  async execute(input: string): Promise<AgentOutput> {
    if (!this.validateInput(input)) {
      return this.formatOutput({ error: 'Invalid input' }, 'error');
    }

    try {
      console.log('⚛️  Frontend Agent: Generating React components with AI...');
      const blueprint = this.context.blueprint;
      const uiDesign = this.context.uiDesign;

      if (!blueprint || !uiDesign) {
        return this.formatOutput(
          { error: 'Missing blueprint or UI design from previous agents' },
          'error'
        );
      }

      const frontendStructure = await this.generateFrontendWithAI(blueprint, uiDesign);
      this.context.frontend = frontendStructure;
      return this.formatOutput(frontendStructure, 'success');
    } catch (error) {
      console.error('Frontend Agent error:', error);
      return this.formatOutput(
        { error: `Failed to generate frontend: ${error}` },
        'error'
      );
    }
  }

  /**
   * Generate complete frontend using AI
   */
  private async generateFrontendWithAI(blueprint: any, uiDesign: any): Promise<FrontendStructure> {
    return {
      projectName: blueprint.appName,
      components: await this.generateComponentsWithAI(blueprint, uiDesign),
      pages: await this.generatePagesWithAI(blueprint),
      hooks: await this.generateHooksWithAI(blueprint),
    };
  }

  /**
   * Generate reusable components
   */
  private async generateComponentsWithAI(blueprint: any, uiDesign: any): Promise<ComponentCode[]> {
    const componentNames = ['Button', 'Card', 'Input', 'Modal', 'Navbar'];
    const components: ComponentCode[] = [];

    for (const componentName of componentNames) {
      try {
        const code = await this.generateComponent(componentName, uiDesign);
        
        // Validate the generated code
        const validation = await this.codeValidator.validateReactComponent(code);
        
        if (!validation.isValid && validation.errors.length > 0) {
          // Try to improve the code if validation failed
          console.log(`⚠️  Fixing component: ${componentName}`);
          const improved = await this.codeValidator.improveCode(code, 'react');
          components.push({
            name: componentName,
            path: `src/components/common/${componentName}.tsx`,
            code: improved.improved,
            dependencies: ['react'],
            tests: await this.generateComponentTests(improved.improved, componentName),
          });
        } else {
          components.push({
            name: componentName,
            path: `src/components/common/${componentName}.tsx`,
            code,
            dependencies: ['react'],
            tests: await this.generateComponentTests(code, componentName),
          });
        }
      } catch (error) {
        console.error(`Error generating component ${componentName}:`, error);
      }
    }

    return components;
  }

  /**
   * Generate single component
   */
  private async generateComponent(componentName: string, uiDesign: any): Promise<string> {
    const prompt = `
Generate a production-ready React component with TypeScript:

Component: ${componentName}
Design: ${JSON.stringify(uiDesign)}

Requirements:
- Use React hooks (functional component)
- TypeScript with strict mode
- Tailwind CSS for styling
- Full accessibility support (ARIA labels)
- Export proper PropTypes with TypeScript
- Include error boundaries
- Support dark mode
- Add JSDoc comments

Output ONLY the component code without markdown formatting.
Component should follow this structure:
1. Imports
2. Type definitions
3. Component implementation
4. Export
`;

    return llmService.generateCode(prompt, 'typescript', {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
    });
  }

  /**
   * Generate page components
   */
  private async generatePagesWithAI(blueprint: any): Promise<ComponentCode[]> {
    const pageNames = ['HomePage', 'DashboardPage', 'ProfilePage'];
    const pages: ComponentCode[] = [];

    for (const pageName of pageNames) {
      try {
        const prompt = `
Generate a production-ready page component:

Page: ${pageName}
App: ${blueprint.appName}
Purpose: ${blueprint.purpose}
Features: ${blueprint.features.join(', ')}

Requirements:
- React functional component with TypeScript
- Use Tailwind CSS for responsive layout
- Include data fetching logic
- Handle loading and error states
- Implement proper routing
- Accessibility compliant
- Performance optimized

Output ONLY the page code without markdown formatting.
`;

        const code = await llmService.generateCode(prompt, 'typescript', {
          provider: 'openai',
          model: 'gpt-4',
        });

        pages.push({
          name: pageName,
          path: `src/pages/${pageName.toLowerCase()}/${pageName}.tsx`,
          code,
          dependencies: ['react', 'react-router-dom'],
        });
      } catch (error) {
        console.error(`Error generating page ${pageName}:`, error);
      }
    }

    return pages;
  }

  /**
   * Generate custom hooks
   */
  private async generateHooksWithAI(blueprint: any): Promise<ComponentCode[]> {
    const hookNames = ['useFetch', 'useForm', 'useLocalStorage'];
    const hooks: ComponentCode[] = [];

    for (const hookName of hookNames) {
      try {
        const prompt = `
Generate a production-ready React hook:

Hook: ${hookName}
App Context: ${blueprint.purpose}

Requirements:
- TypeScript with strict mode
- Proper error handling
- Performance optimized
- Fully typed with generics where applicable
- Include JSDoc documentation
- Follow React best practices

Output ONLY the hook code without markdown formatting.
`;

        const code = await llmService.generateCode(prompt, 'typescript', {
          provider: 'openai',
          model: 'gpt-4',
        });

        hooks.push({
          name: hookName,
          path: `src/hooks/${hookName}.ts`,
          code,
          dependencies: ['react'],
        });
      } catch (error) {
        console.error(`Error generating hook ${hookName}:`, error);
      }
    }

    return hooks;
  }

  /**
   * Generate tests for component
   */
  private async generateComponentTests(componentCode: string, componentName: string): Promise<string> {
    try {
      return await this.codeValidator.generateTests(componentCode, 'jest');
    } catch (error) {
      console.error(`Error generating tests for ${componentName}:`, error);
      return '';
    }
  }
}
