import { ChallengeCard } from '@/components/challenges/challenge-card';

export default function ChallengePage() {
  const challenges = [
    {
      id: '1',
      name: 'Web Performance Challenge',
      url: 'https://example.com/challenges/web-performance',
      date: 'April 15, 2025',
      description:
        'Optimize a web application to achieve a perfect Lighthouse score. Focus on Core Web Vitals and implement best practices for modern web performance.',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      id: '2',
      name: 'Accessibility Hackathon',
      url: 'https://example.com/challenges/accessibility',
      date: 'May 2, 2025',
      description:
        'Create or improve a web application to be fully accessible. Implement ARIA attributes, keyboard navigation, and ensure screen reader compatibility.',
      gradient: 'from-green-400 to-green-600',
    },
    {
      id: '3',
      name: 'Responsive Design Challenge',
      url: 'https://example.com/challenges/responsive',
      date: 'May 20, 2025',
      description:
        'Build a fully responsive website that works flawlessly across all device sizes. Focus on mobile-first design principles and fluid layouts.',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      id: '4',
      name: 'API Integration Marathon',
      url: 'https://example.com/challenges/api-integration',
      date: 'June 10, 2025',
      description:
        'Connect with at least three different public APIs to create a useful application. Demonstrate proper error handling and data management.',
      gradient: 'from-orange-400 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 md:text-3xl">
            Challenges Library
          </h1>
          <p className="max-w-3xl text-gray-600">
            Share coding challenges with your candidates and stack rank them.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
    </div>
  );
}
