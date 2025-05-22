
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TeamMember } from "@/models/teamMember";
import { Feedback, getFeedbackList } from "@/models/feedback";
import FeedbackList from "@/components/FeedbackList";
import { Badge } from "@/components/ui/badge";

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
      
      if (currentUser.isSuperAdmin || currentUser.isAdmin) {
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

  const canViewFeedback = currentUser.isSuperAdmin || currentUser.isAdmin || currentUser.id === member.id;

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
            <CardDescription className="flex flex-col gap-1">
              <span>{member.role}</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {member.team && (
                  <Badge variant="outline">{member.team}</Badge>
                )}
                {member.isSuperAdmin ? (
                  <Badge className="bg-primary/80">Super Admin</Badge>
                ) : member.isAdmin ? (
                  <Badge className="bg-primary/20 text-primary">Admin</Badge>
                ) : null}
              </div>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-4">
            {currentUser.isAdmin || currentUser.isSuperAdmin
              ? `Feedback for ${member.name}`
              : currentUser.id === member.id 
                ? "Feedback Received"
                : "You don't have permission to view this feedback"}
          </h3>
          {canViewFeedback ? (
            <FeedbackList feedbackItems={feedback} loading={loading} />
          ) : (
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
