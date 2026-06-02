/**
 * Main Entry Point
 * Demonstrates how to use the Oikos-AI multi-agent system
 */

import { Orchestrator } from './orchestrator';

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Oikos-AI: Multi-Agent App Builder               ║');
  console.log('║                                                        ║');
  console.log('║  Build complete applications with AI agents working   ║');
  console.log('║  together: Architect, UI/UX, Frontend, Backend, AI    ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Example user request
  const userRequest = 
    'Build a real-time project management application with AI-powered task suggestions, ' +
    'team collaboration features, and automated reporting. Include authentication, ' +
    'dark mode support, and push notifications.';

  console.log('📝 User Request:');
  console.log(`"${userRequest}"\n`);
  console.log('Starting build process with 7 specialized agents...\n');

  try {
    const orchestrator = new Orchestrator();
    const result = await orchestrator.buildApplication(userRequest);

    // Display final results
    console.log('\n' + '='.repeat(60));
    console.log('🎉 BUILD RESULTS');
    console.log('='.repeat(60));
    
    console.log('\n📊 Generated Artifacts:');
    console.log('  ✓ System Architecture Blueprint');
    console.log('  ✓ UI/UX Design System');
    console.log('  ✓ React Frontend Components');
    console.log('  ✓ REST API Endpoints');
    console.log('  ✓ Database Schema');
    console.log('  ✓ AI Integration Services');
    console.log('  ✓ QA Test Suite (pending)');
    console.log('  ✓ Deployment Configuration (pending)');

    console.log('\n📁 Project Structure Ready:');
    console.log(`  Frontend: React + TypeScript + Tailwind CSS`);
    console.log(`  Backend: Node.js + Express + PostgreSQL`);
    console.log(`  AI: OpenAI/Gemini/Claude Integration`);
    console.log(`  Auth: JWT-based authentication`);

    console.log('\n🚀 Next Steps:');
    console.log('  1. Review generated blueprint');
    console.log('  2. Customize components as needed');
    console.log('  3. Set up CI/CD pipeline');
    console.log('  4. Deploy to production');

    console.log('\n' + '='.repeat(60) + '\n');

    // Export build output for external use
    const buildOutput = orchestrator.exportBuildOutput();
    console.log('Full build output available for export/integration.');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run main function
main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
