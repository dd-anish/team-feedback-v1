
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TeamMember } from "@/models/teamMember";
import { Feedback, getFeedbackList } from "@/models/feedback";
import FeedbackList from "@/components/FeedbackList";

interface TeamMemberProfileProps {
  member: TeamMember;
}

const TeamMemberProfile = ({ member }: TeamMemberProfileProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const allFeedback = getFeedbackList();
      // Filter feedback for this specific team member
      const memberFeedback = allFeedback.filter(
        (item) => item.recipientName === member.name
      );
      setFeedback(memberFeedback);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [member]);

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
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-4">Feedback Received</h3>
          <FeedbackList feedbackItems={feedback} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMemberProfile;
