import { NextRequest, NextResponse } from 'next/server';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';

export async function POST(req: NextRequest) {
  try {
    const { githubUrl } = await req.json();
    const apiKey = req.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }           
    const isValid = await supabaseApiKeyService.validateKey(apiKey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    const readmeContent = await getReadmeContent(githubUrl);
    console.log(readmeContent);
    const summary = await summarizeReadme(readmeContent);
    console.log(summary);
    const response = {  
      summary: summary.summary,
      cool_facts: summary.cool_facts
    }
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  async function getReadmeContent(githubUrl: string): Promise<string> {
    // Extract owner and repo from GitHub URL
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
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
      throw new Error('Failed to fetch README content');
    }

    return await response.text();
  }


  async function summarizeReadme(readmeContent: string) {
    console.log("summarizeReadme called");
    console.log("Readme content (first 200 chars):", readmeContent.slice(0, 200));

    const { ChatOpenAI } = await import("@langchain/openai");
    const { PromptTemplate } = await import("@langchain/core/prompts");
    const { StructuredOutputParser } = await import("@langchain/core/output_parsers");
    const { z } = await import("zod");

    // Initialize the model
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0 //0 to make it more predictable
    });

    // Create output parser
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        summary: z.string().describe("A concise summary of the repository"),
        cool_facts: z.array(z.string()).describe("List of interesting facts about the repository")
      })
    );

    // Create the formatting instructions
    const formatInstructions = parser.getFormatInstructions();
    //console.log("Format instructions:", formatInstructions);

    // Create prompt template
    const prompt = PromptTemplate.fromTemplate(
      `Summarize the following GitHub repository README content:
      
      {readme_content}
      
      {format_instructions}
      
      Provide a concise summary and extract interesting facts from the repository.`
    );

    console.log("Prompt created");

    // Create the chain
    const chain = prompt.pipe(model);

    console.log("Chain created");
    
    // Run the chain
    const response = await chain.invoke({
      readme_content: readmeContent,
      format_instructions: formatInstructions
    });

    console.log("Raw model response:", response.text);

    // Parse the response
    const parsedResponse = await parser.parse(response.text);

    console.log("Parsed response:", parsedResponse);
    console.log("summarizeReadme finished");

    return parsedResponse;
  }


} 