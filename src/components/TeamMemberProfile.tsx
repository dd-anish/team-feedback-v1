
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TeamMember } from "@/models/teamMember";
import { Feedback, getFeedbackList } from "@/models/feedback";
import FeedbackList from "@/components/FeedbackList";

interface TeamMemberProfileProps {
  member: TeamMember;
  currentUser: TeamMember;
}

const TeamMemberProfile = ({ member, currentUser }: TeamMemberProfileProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const allFeedback = getFeedbackList();
      
      // Determine which feedback to show based on user permissions
      let memberFeedback;
      
      if (currentUser.isAdmin) {
        // Admins can see all feedback for the selected member
        memberFeedback = allFeedback.filter(
          (item) => item.recipientName === member.name
        );
      } else if (currentUser.id === member.id) {
        // Regular users can only see their own feedback
        memberFeedback = allFeedback.filter(
          (item) => item.recipientName === currentUser.name
        );
      } else {
        // If a regular user is trying to view someone else's feedback, show nothing
        memberFeedback = [];
      }
      
      setFeedback(memberFeedback);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [member, currentUser]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {member.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{member.name}</CardTitle>
            <CardDescription>{member.role}</CardDescription>
            {member.isAdmin && (
              <span className="inline-block mt-1 text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                Admin
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-4">
            {currentUser.isAdmin 
              ? `Feedback for ${member.name}`
              : currentUser.id === member.id 
                ? "Feedback Received"
                : "You don't have permission to view this feedback"}
          </h3>
          {(currentUser.isAdmin || currentUser.id === member.id) && (
            <FeedbackList feedbackItems={feedback} loading={loading} />
          )}
          {(!currentUser.isAdmin && currentUser.id !== member.id) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                You need to be an admin to view other team members' feedback.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMemberProfile;
