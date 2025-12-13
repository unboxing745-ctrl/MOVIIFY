'use client';

import { useState } from 'react';
import { summarizeReviewSentiment } from '@/ai/flows/review-sentiment-summarizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { Review } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface SentimentSummaryProps {
  reviews: Review[];
}

export default function SentimentSummary({ reviews }: SentimentSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (reviews.length === 0) {
      setError('Not enough reviews to summarize.');
      return;
    }
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const reviewText = reviews.map((r) => r.comment).join('\n\n');
      const result = await summarizeReviewSentiment({ reviews: reviewText });
      setSummary(result.summary);
    } catch (e) {
      setError('Could not generate summary.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          <span>AI-Powered Review Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary && <p className="text-foreground/90">{summary}</p>}
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {!summary && !loading && (
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <p className="text-muted-foreground flex-1">
              Get a quick summary of what people are saying.
            </p>
            <Button onClick={handleSummarize} disabled={loading}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
