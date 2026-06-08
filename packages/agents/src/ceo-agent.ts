export interface CEOAgentResponse {
  summary: string;
  nextSteps: string[];
}

export function runCEOAgent(userIdea: string): CEOAgentResponse {
  return {
    summary: `Analyzing idea: ${userIdea}`,
    nextSteps: [
      'Market analysis',
      'Architecture planning',
      'Feature prioritization'
    ]
  };
}
