
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { moderateFeedback } from "@/utils/feedbackModeration";
import { AlertCircle } from "lucide-react";
import { createFeedback, saveFeedback } from "@/models/feedback";
import { TeamMember, getTeamMembers } from "@/models/teamMember";

const feedbackSchema = z.object({
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  feedback: z.string().min(10, "Feedback must be at least 10 characters"),
  isAnonymous: z.boolean().default(false),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  currentUser: TeamMember;
}

const FeedbackForm = ({ currentUser }: FeedbackFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const [teamMembers] = useState<TeamMember[]>(getTeamMembers());

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      recipientName: "",
      feedback: "",
      isAnonymous: false,
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    // Check moderation first
    const moderationResult = moderateFeedback(data.feedback);
    
    if (!moderationResult.isAppropriate) {
      setModerationMessage(moderationResult.reason);
      return;
    }
    
    setModerationMessage(null);
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Create and save feedback
      const newFeedback = createFeedback({
        recipientName: data.recipientName,
        feedback: data.feedback,
        isAnonymous: data.isAnonymous
      }, currentUser.name);
      
      saveFeedback(newFeedback);
      
      // Reset form and show success message
      form.reset();
      setIsSubmitting(false);
      
      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been successfully submitted.",
      });
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Member</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Feedback</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide your feedback here... Be specific and constructive"
                  className="min-h-[150px]" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    setModerationMessage(null);
                  }}
                />
              </FormControl>
              <FormMessage />
              {moderationMessage && (
                <div className="flex items-center gap-2 text-destructive text-sm mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <p>{moderationMessage}</p>
                </div>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Submit anonymously
              </FormLabel>
            </FormItem>
          )}
        />
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Guidelines for providing feedback:</h3>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Be specific and provide examples</li>
            <li>Focus on behaviors, not personality</li>
            <li>Balance positive feedback with areas for improvement</li>
            <li>Suggest actionable steps for improvement</li>
            <li>Be respectful and constructive</li>
          </ul>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
