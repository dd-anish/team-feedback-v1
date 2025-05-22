
// Simple moderation function to check for inappropriate content
// In a real implementation, this would use more sophisticated techniques
// or integrate with an API like OpenAI's moderation endpoint

export function moderateFeedback(text: string): { isAppropriate: boolean; reason?: string } {
  const inappropriateTerms = [
    "stupid", "idiot", "hate", "terrible", "awful", "sucks",
    "useless", "incompetent", "failure", "worthless"
  ];

  const lowerText = text.toLowerCase();
  
  for (const term of inappropriateTerms) {
    if (lowerText.includes(term)) {
      return {
        isAppropriate: false,
        reason: `The feedback contains potentially harmful language: "${term}". Please revise to be more constructive.`
      };
    }
  }
  
  // Check if feedback is too short to be constructive
  if (text.length < 20) {
    return {
      isAppropriate: false,
      reason: "Feedback is too brief. Please provide more detailed and constructive feedback."
    };
  }
  
  return { isAppropriate: true };
}
