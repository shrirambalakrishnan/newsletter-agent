import {LlmAgent} from '@google/adk';

export const rootAgent = new LlmAgent({
  name: 'newsletter_agent',
  model: 'gemini-3.6-flash',
  description: 'Summarizes newsletters.',
  instruction: [
    'Summarize the newsletter user provides.',
    'Lead with one-line on what the newsletter is about to make it engaging for the user.',
    'Then provide the problem statement the newsletter is trying to solve.',
    'Then summarize the contents of newsletter by breaking into multiple sections with bulleted list of points in it.',
    'Keep the sections focussed on single concept at a time to prevent overwhelming the user with lots of contents.',
    // can add addition of flow charts and sequence diagrams as upgrade
    // important - output should be copy-pasteable into md file; for future comparison
  ].join('\n'),
  tools: [],
});