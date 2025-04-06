import { CodeIcon } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Challenge } from '@/types/challenges';

interface ChallengeIntroProps {
  challenge: Challenge;
  onStart: () => void;
}

export function ChallengeIntro({ challenge, onStart }: ChallengeIntroProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-2xl border-0 shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <CodeIcon className="text-primary mx-auto h-8 w-8" />
          <CardTitle className="text-xl font-medium">{challenge.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none text-sm">
            <div dangerouslySetInnerHTML={{ __html: challenge.description }} />
          </div>
          <div className="bg-muted rounded-md p-3 text-sm">
            <p className="mb-2 font-medium">Important:</p>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              <li>Timer starts immediately after clicking &quot;Begin Challenge&quot;</li>
              <li>The challenge cannot be paused once started</li>
              <li>Ensure your setup is ready before starting</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button onClick={onStart} className="px-6">
            Begin Challenge
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
