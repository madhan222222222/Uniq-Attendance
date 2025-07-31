'use server';

/**
 * @fileOverview An AI assistant that suggests reason codes and messages when marking a student absent.
 *
 * - AbsentReasonCodeInput - The input type for the absentReasonCode function.
 * - AbsentReasonCodeOutput - The return type for the absentReasonCode function.
 * - absentReasonCode - A function that suggests reason codes and messages when a student is marked absent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AbsentReasonCodeInputSchema = z.object({
  studentName: z.string().describe('The name of the student who is absent.'),
  batchDetails: z.string().describe('Details about the batch the student belongs to, including location and timings.'),
  date: z.string().describe('The date of the absence.'),
  knownAbsenceReasons: z.string().describe('Known reasons why students might be absent.  Explain that this list is not exhaustive, and the LLM should not be afraid to suggest a new one.'),
});
export type AbsentReasonCodeInput = z.infer<typeof AbsentReasonCodeInputSchema>;

const AbsentReasonCodeOutputSchema = z.object({
  reasonCode: z.string().describe('A short code representing the reason for the absence.'),
  message: z.string().describe('A message explaining the reason for the absence, suitable for sending to parents.'),
});
export type AbsentReasonCodeOutput = z.infer<typeof AbsentReasonCodeOutputSchema>;

export async function absentReasonCode(input: AbsentReasonCodeInput): Promise<AbsentReasonCodeOutput> {
  return absentReasonCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'absentReasonCodePrompt',
  input: {schema: AbsentReasonCodeInputSchema},
  output: {schema: AbsentReasonCodeOutputSchema},
  prompt: `You are a helpful assistant for school staff. When a student is marked absent, you suggest a reason code and a message to send to the student's parents.

Here are the details of the absence:

Student Name: {{{studentName}}}
Batch Details: {{{batchDetails}}}
Date: {{{date}}}

Here are some known absence reasons, but you are free to suggest others:
{{{knownAbsenceReasons}}}

Reason Code: {{reasonCode}}
Message: {{message}}`,
});

const absentReasonCodeFlow = ai.defineFlow(
  {
    name: 'absentReasonCodeFlow',
    inputSchema: AbsentReasonCodeInputSchema,
    outputSchema: AbsentReasonCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

