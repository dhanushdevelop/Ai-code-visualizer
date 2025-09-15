import { GoogleGenAI, Type } from "@google/genai";
import { type VisualizationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      description: "An array of objects, where each object represents a node in the execution flow graph.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique string identifier for the node (e.g., 'n1', 'n2')." },
          label: { type: Type.STRING, description: "A very short title or summary for the node (e.g., 'Start', 'if (n === 0)')." },
          explanation: { type: Type.STRING, description: "A general explanation of what this code block does." },
          codeSnippet: { type: Type.STRING, description: "The relevant line or block of code for this node." },
          type: { type: Type.STRING, description: "The node's role, one of: 'start', 'end', 'process', 'decision'." },
          position: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER, description: "The x-coordinate for the node's position on a 2D canvas." },
              y: { type: Type.NUMBER, description: "The y-coordinate for the node's position on a 2D canvas." }
            },
            required: ["x", "y"]
          }
        },
        required: ["id", "label", "explanation", "codeSnippet", "type", "position"]
      }
    },
    edges: {
      type: Type.ARRAY,
      description: "An array of objects, where each object represents a directed edge connecting two nodes.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique string identifier for the edge (e.g., 'e1', 'e2')." },
          source: { type: Type.STRING, description: "The 'id' of the starting node for this edge." },
          target: { type: Type.STRING, description: "The 'id' of the ending node for this edge." },
          label: { type: Type.STRING, description: "An optional label for the edge, especially for decision branches (e.g., 'true', 'false')." }
        },
        required: ["id", "source", "target"]
      }
    },
    executionTrace: {
      type: Type.ARRAY,
      description: "An ordered array of execution steps. Each object represents a single step in the execution flow.",
      items: {
        type: Type.OBJECT,
        properties: {
          nodeId: { type: Type.STRING, description: "The 'id' of the graph node corresponding to this execution step." },
          explanation: { type: Type.STRING, description: "A detailed, step-specific explanation. For example, mention the current values of variables." },
          line: { type: Type.NUMBER, description: "The 1-based line number in the original code that is being executed in this step." },
          variables: { 
            type: Type.STRING,
            description: "An optional JSON string representing the state of variables in the current scope *after* this step has executed. Represent arrays and simple objects fully. Example: '{\"a\":5, \"arr\": [1, 2]}' or '{\"obj\": {\"x\": 1}}'.",
          },
          callStack: {
            type: Type.ARRAY,
            description: "An optional array of strings representing the call stack. The last element is the current function. Example: ['main', 'factorial(4)', 'factorial(3)'].",
            items: { type: Type.STRING }
          }
        },
        required: ["nodeId", "explanation", "line"]
      }
    }
  },
  required: ["nodes", "edges", "executionTrace"],
};

export async function visualizeCode(code: string): Promise<VisualizationResult> {
  const prompt = `
    Analyze the following code and represent its execution flow as a directed graph AND a step-by-step execution trace.
    Act as an expert code execution analyzer. Your output must be a single, valid JSON object that adheres to the provided schema.

    - **Nodes**: Represent blocks of code. Position them logically for a clear, top-down flowchart on a 1000px canvas.
    - **Edges**: Connect nodes to show control flow.
    - **executionTrace**: This is the MOST IMPORTANT part. Provide an ordered array of execution steps like a debugger.
      - **'nodeId'**: The ID of the node being executed.
      - **'line'**: The 1-based line number of the code being executed for this step.
      - **'explanation'**: A specific, runtime-like explanation for THIS step. If a function is called, state the arguments. For decisions, explain why the condition is true/false based on variable values.
      - **'variables'**: (Optional) A JSON STRING representing the variable state in the current scope. Update this at each step. Fully represent arrays and simple objects. E.g., '{"a": 5, "myArray": [1, 2, 3]}'.
      - **'callStack'**: (Optional) An array of strings representing the call stack. The last element is the currently executing function. For global scope, you can use ['(global)']. For a call like 'factorial(3)', an entry could be 'factorial(3)'.

    Example 'executionTrace' for 'function greet(name) { return "Hello, " + name; } greet("World");':
    [
      { "nodeId": "n1", "line": 1, "explanation": "Function 'greet' is defined.", "callStack": ["(global)"] },
      { "nodeId": "n2", "line": 2, "explanation": "Calling function 'greet' with argument 'World'.", "callStack": ["(global)"] },
      { "nodeId": "n1", "line": 1, "explanation": "Entering 'greet' with 'name' = 'World'.", "variables": "{\\"name\\": \\"World\\"}", "callStack": ["(global)", "greet(\\"World\\")"] },
      { "nodeId": "n1", "line": 1, "explanation": "Returning from 'greet' with value 'Hello, World'.", "variables": "{\\"name\\": \\"World\\"}", "callStack": ["(global)", "greet(\\"World\\")"] },
      { "nodeId": "n2", "line": 2, "explanation": "Function 'greet' returned 'Hello, World'.", "callStack": ["(global)"] }
    ]

    Code to analyze:
    \`\`\`
    ${code}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Lower temperature for more deterministic, structured output
      },
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.nodes) && Array.isArray(result.edges) && Array.isArray(result.executionTrace)) {
      return result as VisualizationResult;
    } else {
      throw new Error("AI response did not match the expected format with nodes, edges, and executionTrace.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error("API rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error("Failed to get visualization from AI. The model may have generated an invalid response.");
  }
}