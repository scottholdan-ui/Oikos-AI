/**
 * Code Validation and Improvement Pipeline
 * Comprehensive example showing full validation workflow
 */

import { codeValidator } from '../services/code-validator';
import { llmService } from '../services/llm-service';

export class CodeQualityPipeline {
  /**
   * Complete validation and improvement pipeline
   */
  async validateAndImproveCode(code: string, codeType: 'typescript' | 'react' | 'python' = 'typescript'): Promise<{
    original: string;
    validated: boolean;
    validationReport: any;
    improved: string;
    improvements: string[];
    tests: string;
    documentation: string;
    security: string;
    performance: string;
  }> {
    console.log('📋 Starting code validation pipeline...\n');

    // Step 1: Validate
    console.log('1️⃣  Validating code...');
    let validationReport;
    
    if (codeType === 'react') {
      validationReport = await codeValidator.validateReactComponent(code);
    } else if (codeType === 'typescript') {
      validationReport = await codeValidator.validateTypeScript(code);
    }

    const isValid = validationReport?.isValid || false;
    console.log(`   Result: ${isValid ? '✅ Valid' : '⚠️  Issues found'}`);
    if (validationReport?.errors?.length) {
      console.log(`   Errors: ${validationReport.errors.join(', ')}`);
    }

    // Step 2: Improve if needed
    console.log('\n2️⃣  Improving code quality...');
    const improved = await codeValidator.improveCode(code, codeType);
    console.log(`   ✅ Generated improved version`);
    console.log(`   Changes: ${improved.changes.length}`);

    // Step 3: Generate tests
    console.log('\n3️⃣  Generating tests...');
    const tests = await codeValidator.generateTests(improved.improved, 'jest');
    console.log(`   ✅ Test suite generated`);

    // Step 4: Generate documentation
    console.log('\n4️⃣  Generating documentation...');
    const documentation = await codeValidator.generateDocumentation(improved.improved);
    console.log(`   ✅ Documentation created`);

    // Step 5: Security audit
    console.log('\n5️⃣  Running security audit...');
    const security = await codeValidator.securityAudit(improved.improved);
    console.log(`   ✅ Security audit complete`);

    // Step 6: Performance optimization
    console.log('\n6️⃣  Optimizing performance...');
    const performance = await codeValidator.optimizePerformance(improved.improved);
    console.log(`   ✅ Performance optimized`);

    console.log('\n✅ Validation pipeline complete!\n');

    return {
      original: code,
      validated: isValid,
      validationReport,
      improved: improved.improved,
      improvements: improved.changes,
      tests,
      documentation,
      security: security.explanation || security.improved,
      performance: performance.explanation || performance.improved,
    };
  }

  /**
   * Continuous improvement: iterate until quality target met
   */
  async improveUntilQuality(
    code: string,
    targetQuality: number = 85,
    maxIterations: number = 3
  ): Promise<{ finalCode: string; iterations: number; qualityScore: number }> {
    let currentCode = code;
    let iteration = 0;
    let qualityScore = 0;

    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n🔄 Iteration ${iteration}/${maxIterations}`);

      const validation = await codeValidator.validateTypeScript(currentCode);
      qualityScore = validation.quality.overall;

      console.log(`   Quality Score: ${qualityScore}/100`);

      if (qualityScore >= targetQuality) {
        console.log(`✅ Target quality reached! (${qualityScore}/${targetQuality})`);
        break;
      }

      // Improve further
      if (iteration < maxIterations) {
        const improved = await codeValidator.improveCode(currentCode);
        currentCode = improved.improved;
        console.log(`   Applied improvements: ${improved.changes.join(', ')}`);
      }
    }

    return {
      finalCode: currentCode,
      iterations: iteration,
      qualityScore,
    };
  }
}

/**
 * Example usage in an agent
 */
export async function exampleUsage() {
  const sampleCode = `
function getData(id) {
  var data = fetch('/api/data/' + id);
  return data;
}
`;

  const pipeline = new CodeQualityPipeline();

  // Run full pipeline
  const result = await pipeline.validateAndImproveCode(sampleCode, 'typescript');

  console.log('📊 Results:');
  console.log(`- Valid: ${result.validated}`);
  console.log(`- Quality Improvements: ${result.improvements.length}`);
  console.log(`- Tests Generated: ${result.tests.length > 0}`);

  // Or improve until quality target
  const optimization = await pipeline.improveUntilQuality(sampleCode, 85, 5);
  console.log(`\n✅ Final quality score: ${optimization.qualityScore}`);
  console.log(`   Completed in ${optimization.iterations} iterations`);
}
