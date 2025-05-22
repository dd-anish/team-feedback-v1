import { useEffect, useState } from "react";
import { format } from "date-fns";
import { User } from "lucide-react";
import { Feedback, getFeedbackList } from "@/models/feedback";

interface FeedbackListProps {
  feedbackItems?: Feedback[];
  loading?: boolean;
}

const FeedbackList = ({ feedbackItems, loading = true }: FeedbackListProps) => {
  const [items, setItems] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    if (feedbackItems) {
      // If feedback items are provided via props, use them
      setItems(feedbackItems);
      setIsLoading(loading);
    } else {
      // Otherwise, load all feedback (original behavior)
      const timer = setTimeout(() => {
        const loadedItems = getFeedbackList();
        setItems(loadedItems);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [feedbackItems, loading]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse flex flex-col w-full gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted rounded-lg p-6 w-full h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted inline-flex rounded-full p-3">
          <User className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No feedback yet</h3>
        <p className="mt-2 text-muted-foreground">
          You haven't received any feedback yet. When you do, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <p className="font-medium">
                {item.senderName}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(item.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{item.feedback}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
