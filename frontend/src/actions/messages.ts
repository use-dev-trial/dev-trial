'use server';

// import axios from 'axios';
import {
  MessageRequest,
  MessageResponse,
  QuestionUpdate,
  messageResponseSchema,
} from '@/lib/messages';

// Helper function to simulate question updates based on user input
function generateDummyResponse(content: string): Partial<MessageResponse> {
  const contentLower = content.toLowerCase();

  const response: Partial<MessageResponse> = {
    id: 'dummy-id-' + Date.now(),
    content: `I've processed your request: "${content}". `,
  };

  const questionUpdate: Partial<QuestionUpdate> = {};
  let updatedSections: ('title' | 'description' | 'requirements' | 'sampleInteractions')[] = [];

  // Special case: update multiple sections at once or sequentially for animation demo
  if (
    contentLower.includes('update all') ||
    contentLower.includes('show animation') ||
    contentLower.includes('animate')
  ) {
    questionUpdate.title = 'Comprehensive Code Review Platform';
    questionUpdate.description =
      'Create a full-featured code review platform that enables teams to collaborate effectively on code quality improvements. The platform should integrate with common version control systems and provide detailed analytics.';
    questionUpdate.requirements = [
      'Support for GitHub, GitLab, and Bitbucket integration',
      'Real-time collaboration with live updates',
      'AI-powered code quality suggestions',
      'Customizable review workflows',
      'Performance metrics dashboard',
    ];
    questionUpdate.sampleInteractions = [
      {
        title: 'Repository Connection',
        steps: [
          'User connects their repository via OAuth',
          'System imports existing PRs and issues',
          'Initial code quality scan runs automatically',
        ],
      },
      {
        title: 'Collaborative Review',
        steps: [
          'Multiple reviewers can comment simultaneously',
          'Threaded conversations on specific code blocks',
          'Resolution tracking for identified issues',
        ],
      },
    ];
    updatedSections = ['title', 'description', 'requirements', 'sampleInteractions'];
    response.content =
      "I've updated all sections of your question with comprehensive details for a code review platform. You should see animations on all sections now!";

    // Return immediately for this special case
    response.questionUpdate = questionUpdate;
    response.updatedSections = updatedSections;
    return response;
  }

  // Update title section
  if (contentLower.includes('title')) {
    questionUpdate.title = 'React Component for Code Quality Review';
    updatedSections.push('title');
    response.content += 'Updated the title. ';
  }

  // Update description section
  if (contentLower.includes('description')) {
    questionUpdate.description =
      'Build a React component that allows developers to review code snippets and provide feedback on code quality. The component should be responsive and follow modern design principles.';
    updatedSections.push('description');
    response.content += 'Updated the description. ';
  }

  // Update requirements section
  if (contentLower.includes('requirement') || contentLower.includes('requirements')) {
    questionUpdate.requirements = [
      'Component must support syntax highlighting for multiple languages',
      'Users should be able to add inline comments to specific lines of code',
      'Include upvote and downvote functionality for feedback',
      'Implement a rating system for code quality metrics',
      'Support light and dark mode themes',
    ];
    updatedSections.push('requirements');
    response.content += 'Updated the requirements. ';
  }

  // Update sample interactions section
  if (contentLower.includes('interaction') || contentLower.includes('sample')) {
    questionUpdate.sampleInteractions = [
      {
        title: 'Code Submission',
        steps: [
          'User pastes code into the editor',
          'Syntax highlighting is automatically applied',
          'User can select language if auto-detection fails',
        ],
      },
      {
        title: 'Reviewing Process',
        steps: [
          'Reviewer selects specific line to comment on',
          'Comment form appears with rating options',
          'Reviewer submits feedback which appears in the thread',
        ],
      },
      {
        title: 'Quality Assessment',
        steps: [
          'System calculates overall score based on ratings',
          'Visual indicator shows code health',
          'Suggestions for improvement are generated',
        ],
      },
    ];
    updatedSections.push('sampleInteractions');
    response.content += 'Updated the sample interactions. ';
  }

  // If nothing specific was mentioned, provide a helpful message
  if (!updatedSections.length) {
    response.content =
      'To see section animations, try asking me to update a specific part of the question (title, description, requirements, or sample interactions) or say "update all" to see all sections update at once.';
  } else {
    // Only include updates if we have sections to update
    response.questionUpdate = questionUpdate;
    response.updatedSections = updatedSections;
  }

  return response;
}

export async function send(request: MessageRequest): Promise<MessageResponse> {
  try {
    // For demonstration purposes, use dummy data instead of actual API call
    // Generate dummy response data based on the user's message
    // const response = await axios.post(
    //   `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/messages`,
    //   request,
    // );
    // console.log(messageResponseSchema.parse(response.data));
    // return messageResponseSchema.parse(response.data);
    const dummyResponse = generateDummyResponse(request.content);

    // Parse with our schema to ensure it's valid
    return messageResponseSchema.parse(dummyResponse);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
