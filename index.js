#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

// Sample documents with metadata
const sampleDocuments = [
  {
    id: "doc_1",
    title: "The Art of Programming",
    content: "Programming is a creative and logical process that combines problem-solving with technical skills. It requires patience, attention to detail, and continuous learning. The best programmers are those who can think abstractly while maintaining focus on practical solutions.",
    metadata: {
      author: "Tech Writer",
      category: "Technology",
      dateCreated: "2024-01-15",
      tags: ["programming", "skills", "technology"]
    }
  },
  {
    id: "doc_2",
    title: "Climate Change Effects",
    content: "Climate change poses significant threats to our planet's ecosystems. Rising temperatures, melting ice caps, and extreme weather events are becoming more frequent. Immediate action is required to mitigate these devastating effects on future generations.",
    metadata: {
      author: "Environmental Scientist",
      category: "Environment",
      dateCreated: "2024-01-20",
      tags: ["climate", "environment", "urgent"]
    }
  },
  {
    id: "doc_3",
    title: "Morning Coffee Ritual",
    content: "There's something magical about the first cup of coffee in the morning. The aroma fills the kitchen, the warmth spreads through your hands, and that first sip awakens your senses. It's a simple pleasure that makes every day a little brighter.",
    metadata: {
      author: "Lifestyle Blogger",
      category: "Lifestyle",
      dateCreated: "2024-01-25",
      tags: ["coffee", "morning", "routine"]
    }
  },
  {
    id: "doc_4",
    title: "Economic Recession Analysis",
    content: "The current economic downturn has created widespread unemployment and financial instability. Businesses are struggling to survive, families are losing homes, and the stock market continues to decline. This crisis requires immediate government intervention.",
    metadata: {
      author: "Economic Analyst",
      category: "Economics",
      dateCreated: "2024-02-01",
      tags: ["recession", "economy", "crisis"]
    }
  },
  {
    id: "doc_5",
    title: "Space Exploration Breakthrough",
    content: "Recent discoveries in space exploration have revealed fascinating insights about distant galaxies. New telescope technology allows us to observe celestial bodies with unprecedented clarity. These achievements represent humanity's greatest scientific accomplishments.",
    metadata: {
      author: "Space Researcher",
      category: "Science",
      dateCreated: "2024-02-05",
      tags: ["space", "discovery", "science"]
    }
  },
  {
    id: "doc_6",
    title: "Healthy Eating Habits",
    content: "Maintaining a balanced diet is essential for optimal health and well-being. Fresh fruits, vegetables, whole grains, and lean proteins provide the nutrients your body needs. Small changes in eating habits can lead to significant improvements in energy and mood.",
    metadata: {
      author: "Nutritionist",
      category: "Health",
      dateCreated: "2024-02-10",
      tags: ["nutrition", "health", "diet"]
    }
  },
  {
    id: "doc_7",
    title: "Digital Privacy Concerns",
    content: "The erosion of digital privacy has become a serious threat to personal freedom. Tech companies collect vast amounts of personal data without proper consent. Users are unknowingly surrendering their privacy for convenience, creating dangerous precedents for surveillance.",
    metadata: {
      author: "Privacy Advocate",
      category: "Technology",
      dateCreated: "2024-02-15",
      tags: ["privacy", "data", "surveillance"]
    }
  },
  {
    id: "doc_8",
    title: "Mountain Hiking Adventure",
    content: "The trail wound through dense forests and across babbling streams. Each step brought new vistas of snow-capped peaks and valleys below. The fresh mountain air filled our lungs as we climbed higher, feeling accomplished and connected to nature.",
    metadata: {
      author: "Adventure Writer",
      category: "Travel",
      dateCreated: "2024-02-20",
      tags: ["hiking", "mountains", "adventure"]
    }
  },
  {
    id: "doc_9",
    title: "Remote Work Challenges",
    content: "Working from home presents unique difficulties that many professionals struggle with daily. Isolation, distractions, and communication barriers can severely impact productivity and mental health. Companies must develop better strategies to support remote employees.",
    metadata: {
      author: "HR Specialist",
      category: "Work",
      dateCreated: "2024-02-25",
      tags: ["remote", "work", "challenges"]
    }
  },
  {
    id: "doc_10",
    title: "Artificial Intelligence Future",
    content: "Artificial intelligence will revolutionize industries and transform how we work and live. From healthcare to transportation, AI promises incredible innovations and solutions. However, we must carefully consider the ethical implications and ensure responsible development.",
    metadata: {
      author: "AI Researcher",
      category: "Technology",
      dateCreated: "2024-03-01",
      tags: ["AI", "future", "innovation"]
    }
  },
  {
    id: "doc_11",
    title: "Urban Garden Success",
    content: "Growing vegetables in small urban spaces brings immense joy and satisfaction. Fresh tomatoes, herbs, and leafy greens thrive in containers on balconies and rooftops. Urban gardening connects city dwellers with nature while providing healthy, homegrown food.",
    metadata: {
      author: "Urban Gardener",
      category: "Lifestyle",
      dateCreated: "2024-03-05",
      tags: ["gardening", "urban", "food"]
    }
  },
  {
    id: "doc_12",
    title: "Financial Market Volatility",
    content: "Stock markets are experiencing unprecedented volatility with dramatic swings in prices. Investors are panicking, pulling money from risky assets, and seeking safer investments. This uncertainty reflects deeper economic problems that may persist for years.",
    metadata: {
      author: "Financial Analyst",
      category: "Finance",
      dateCreated: "2024-03-10",
      tags: ["stocks", "volatility", "investment"]
    }
  },
  {
    id: "doc_13",
    title: "Learning New Languages",
    content: "Mastering a foreign language opens doors to new cultures and opportunities. The process requires dedication, practice, and patience, but the rewards are tremendous. Speaking multiple languages enhances cognitive abilities and creates meaningful connections with people worldwide.",
    metadata: {
      author: "Language Teacher",
      category: "Education",
      dateCreated: "2024-03-15",
      tags: ["language", "learning", "culture"]
    }
  },
  {
    id: "doc_14",
    title: "Ocean Pollution Crisis",
    content: "Plastic waste is destroying marine ecosystems at an alarming rate. Sea creatures are dying from ingesting microplastics, coral reefs are bleaching, and toxic chemicals are contaminating the food chain. This environmental disaster demands immediate global action.",
    metadata: {
      author: "Marine Biologist",
      category: "Environment",
      dateCreated: "2024-03-20",
      tags: ["ocean", "pollution", "marine"]
    }
  },
  {
    id: "doc_15",
    title: "Creative Writing Workshop",
    content: "Writers gathered to share stories and provide constructive feedback. The workshop fostered creativity, encouraged experimentation, and built a supportive community. Participants left feeling inspired and motivated to continue their writing journeys with renewed passion.",
    metadata: {
      author: "Writing Instructor",
      category: "Arts",
      dateCreated: "2024-03-25",
      tags: ["writing", "creativity", "workshop"]
    }
  },
  {
    id: "doc_16",
    title: "Renewable Energy Progress",
    content: "Solar and wind power technologies are advancing rapidly, becoming more efficient and cost-effective. Countries are investing heavily in clean energy infrastructure, creating jobs and reducing carbon emissions. This transition to renewable energy offers hope for a sustainable future.",
    metadata: {
      author: "Energy Analyst",
      category: "Environment",
      dateCreated: "2024-03-30",
      tags: ["renewable", "energy", "sustainable"]
    }
  }
];

// Document storage (in-memory for this example)
let documents = [...sampleDocuments];

// Sentiment analysis function
function analyzeSentiment(text) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant', 'outstanding', 'perfect', 'beautiful', 'love', 'enjoy', 'happy', 'pleased', 'delighted', 'excited', 'thrilled', 'joy', 'success', 'achievement', 'breakthrough', 'innovative', 'revolutionary', 'hope', 'optimistic', 'positive', 'bright', 'magical', 'accomplished', 'satisfaction', 'tremendous', 'inspiring', 'motivated', 'passionate', 'efficient', 'effective', 'sustainable'];
  
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'angry', 'sad', 'disappointed', 'frustrated', 'annoyed', 'upset', 'worried', 'concerned', 'problem', 'issue', 'crisis', 'disaster', 'failure', 'decline', 'threat', 'danger', 'risk', 'difficult', 'struggle', 'challenge', 'devastating', 'serious', 'urgent', 'alarming', 'destroying', 'toxic', 'contaminating', 'panicking', 'uncertainty', 'volatility', 'threats', 'erosion', 'surveillance', 'barriers', 'isolation', 'difficulties'];

  const words = text.toLowerCase().split(/\W+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });

  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) return { sentiment: 'neutral', confidence: 0, positive: 0, negative: 0 };

  const positiveRatio = positiveCount / totalSentimentWords;
  const negativeRatio = negativeCount / totalSentimentWords;

  let sentiment = 'neutral';
  let confidence = 0;

  if (positiveRatio > 0.6) {
    sentiment = 'positive';
    confidence = positiveRatio;
  } else if (negativeRatio > 0.6) {
    sentiment = 'negative';
    confidence = negativeRatio;
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = positiveRatio;
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = negativeRatio;
  }

  return {
    sentiment,
    confidence: Math.round(confidence * 100) / 100,
    positive: positiveCount,
    negative: negativeCount
  };
}

// Keyword extraction function
function extractKeywords(text, limit = 10) {
  const commonWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'will', 'an', 'be', 'or', 'of', 'with', 'his', 'they', 'i', 'that', 'it', 'have', 'from', 'for', 'by', 'had', 'has', 'he', 'in', 'she', 'you', 'we', 'can', 'said', 'her', 'each', 'their', 'time', 'if', 'do', 'go', 'him', 'how', 'its', 'may', 'no', 'than', 'them', 'these', 'way', 'who', 'oil', 'sit', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'new', 'also', 'any', 'after', 'back', 'other', 'many', 'must', 'over', 'such', 'our', 'out', 'up', 'use', 'her', 'would', 'make', 'water', 'into', 'only', 'could', 'my', 'first', 'well', 'way', 'been', 'call', 'who', 'oil', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'new', 'also', 'any', 'after', 'back', 'other', 'many', 'must', 'over', 'such', 'our', 'out', 'up', 'use'];

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));

  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, frequency]) => ({ word, frequency }));
}

// Readability scoring function (Flesch Reading Ease approximation)
function calculateReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) {
    return { score: 0, level: 'Invalid text' };
  }

  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  
  let level = '';
  if (fleschScore >= 90) level = 'Very Easy';
  else if (fleschScore >= 80) level = 'Easy';
  else if (fleschScore >= 70) level = 'Fairly Easy';
  else if (fleschScore >= 60) level = 'Standard';
  else if (fleschScore >= 50) level = 'Fairly Difficult';
  else if (fleschScore >= 30) level = 'Difficult';
  else level = 'Very Difficult';

  return {
    score: Math.round(fleschScore * 100) / 100,
    level,
    avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100
  };
}

// Helper function to count syllables
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Basic text statistics
function getTextStats(text) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    characterCount: characters,
    characterCountNoSpaces: charactersNoSpaces,
    avgWordsPerSentence: sentences.length > 0 ? Math.round((words.length / sentences.length) * 100) / 100 : 0
  };
}

// Full document analysis
function analyzeDocument(document) {
  const sentiment = analyzeSentiment(document.content);
  const keywords = extractKeywords(document.content);
  const readability = calculateReadability(document.content);
  const stats = getTextStats(document.content);

  return {
    id: document.id,
    title: document.title,
    metadata: document.metadata,
    sentiment,
    keywords,
    readability,
    stats,
    analysisDate: new Date().toISOString()
  };
}

// Search documents
function searchDocuments(query) {
  const queryLower = query.toLowerCase();
  return documents.filter(doc => {
    return doc.title.toLowerCase().includes(queryLower) ||
           doc.content.toLowerCase().includes(queryLower) ||
           doc.metadata.category.toLowerCase().includes(queryLower) ||
           doc.metadata.author.toLowerCase().includes(queryLower) ||
           doc.metadata.tags.some(tag => tag.toLowerCase().includes(queryLower));
  });
}

// Create MCP server
const server = new Server(
  {
    name: 'text-analysis-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_document',
        description: 'Analyze a document by ID for sentiment, keywords, readability, and statistics',
        inputSchema: {
          type: 'object',
          properties: {
            document_id: {
              type: 'string',
              description: 'The ID of the document to analyze'
            }
          },
          required: ['document_id']
        }
      },
      {
        name: 'get_sentiment',
        description: 'Analyze sentiment of any text',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to analyze for sentiment'
            }
          },
          required: ['text']
        }
      },
      {
        name: 'extract_keywords',
        description: 'Extract top keywords from any text',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to extract keywords from'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of keywords to return (default: 10)',
              default: 10
            }
          },
          required: ['text']
        }
      },
      {
        name: 'add_document',
        description: 'Add a new document to the collection',
        inputSchema: {
          type: 'object',
          properties: {
            document_data: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                metadata: {
                  type: 'object',
                  properties: {
                    author: { type: 'string' },
                    category: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } }
                  }
                }
              },
              required: ['title', 'content']
            }
          },
          required: ['document_data']
        }
      },
      {
        name: 'search_documents',
        description: 'Search documents by content, title, category, author, or tags',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'list_documents',
        description: 'List all available documents with basic info',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'analyze_document':
        const doc = documents.find(d => d.id === args.document_id);
        if (!doc) {
          throw new McpError(ErrorCode.InvalidParams, `Document with ID ${args.document_id} not found`);
        }
        const analysis = analyzeDocument(doc);
        return { content: [{ type: 'text', text: JSON.stringify(analysis, null, 2) }] };

      case 'get_sentiment':
        const sentiment = analyzeSentiment(args.text);
        return { content: [{ type: 'text', text: JSON.stringify(sentiment, null, 2) }] };

      case 'extract_keywords':
        const keywords = extractKeywords(args.text, args.limit || 10);
        return { content: [{ type: 'text', text: JSON.stringify(keywords, null, 2) }] };

      case 'add_document':
        const newDoc = {
          id: `doc_${documents.length + 1}`,
          title: args.document_data.title,
          content: args.document_data.content,
          metadata: {
            author: args.document_data.metadata?.author || 'Unknown',
            category: args.document_data.metadata?.category || 'General',
            dateCreated: new Date().toISOString().split('T')[0],
            tags: args.document_data.metadata?.tags || []
          }
        };
        documents.push(newDoc);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, document: newDoc }, null, 2) }] };

      case 'search_documents':
        const searchResults = searchDocuments(args.query);
        return { content: [{ type: 'text', text: JSON.stringify(searchResults, null, 2) }] };

      case 'list_documents':
        const docList = documents.map(doc => ({
          id: doc.id,
          title: doc.title,
          author: doc.metadata.author,
          category: doc.metadata.category,
          dateCreated: doc.metadata.dateCreated,
          tags: doc.metadata.tags,
          wordCount: getTextStats(doc.content).wordCount
        }));
        return { content: [{ type: 'text', text: JSON.stringify(docList, null, 2) }] };

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Error executing tool: ${error.message}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Text Analysis MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});