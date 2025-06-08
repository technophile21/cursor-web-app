import { NextRequest, NextResponse } from 'next/server';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';

export async function POST(req: NextRequest) {
  try {
    const { githubUrl } = await req.json();
    
    if (!githubUrl) {
      return NextResponse.json({ error: 'GitHub URL is required' }, { status: 400 });
    }

    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }           
    
    const isValid = await supabaseApiKeyService.validateKey(apiKey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    try {
      const readmeContent = await getReadmeContent(githubUrl);
      console.log('Successfully fetched README content');
      
      const summary = await summarizeReadme(readmeContent);
      console.log('Successfully generated summary');
      
      const response = {  
        summary: summary.summary,
        cool_facts: summary.cool_facts
      }
      return NextResponse.json(response);
    } catch (error) {
      console.error('Error processing GitHub repository:', error);
      if (error instanceof Error) {
        return NextResponse.json({ 
          error: 'Failed to process GitHub repository',
          details: error.message 
        }, { status: 500 });
      }
      throw error; // Re-throw if it's not an Error object
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getReadmeContent(githubUrl: string): Promise<string> {
  try {
    // Extract owner and repo from GitHub URL
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    if (urlParts.length < 2) {
      throw new Error('Invalid GitHub URL format');
    }
    
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Fetch readme content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.raw+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching README:', error);
    throw error;
  }
}

async function summarizeReadme(readmeContent: string) {
  try {
    console.log("Starting README summarization");
    console.log("Readme content length:", readmeContent.length);

    const { ChatOpenAI } = await import("@langchain/openai");
    const { PromptTemplate } = await import("@langchain/core/prompts");
    const { StructuredOutputParser } = await import("@langchain/core/output_parsers");
    const { z } = await import("zod");

    // Initialize the model
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0
    });

    // Create output parser
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        summary: z.string().describe("A concise summary of the repository"),
        cool_facts: z.array(z.string()).describe("List of interesting facts about the repository")
      })
    );

    const formatInstructions = parser.getFormatInstructions();

    const prompt = PromptTemplate.fromTemplate(
      `Summarize the following GitHub repository README content:
      
      {readme_content}
      
      {format_instructions}
      
      Provide a concise summary and extract interesting facts from the repository.`
    );

    const chain = prompt.pipe(model);
    
    const response = await chain.invoke({
      readme_content: readmeContent,
      format_instructions: formatInstructions
    });

    console.log("Raw model response received");

    const parsedResponse = await parser.parse(response.text);
    console.log("Successfully parsed model response");

    return parsedResponse;
  } catch (error) {
    console.error('Error in summarizeReadme:', error);
    throw error;
  }
} 