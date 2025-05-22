
import { useState } from "react";
import { User } from "lucide-react";
import { TeamMember, getTeamMembers } from "@/models/teamMember";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamSidebarProps {
  onSelectMember: (member: TeamMember) => void;
  selectedMemberId?: number;
}

const TeamSidebar = ({ onSelectMember, selectedMemberId }: TeamSidebarProps) => {
  const [members] = useState<TeamMember[]>(getTeamMembers());

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Team Feedback</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Team Members</SidebarGroupLabel>
          <SidebarMenu>
            {members.map((member) => (
              <SidebarMenuItem key={member.id}>
                <SidebarMenuButton 
                  isActive={selectedMemberId === member.id}
                  onClick={() => onSelectMember(member)}
                  tooltip={member.role}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="text-xs">
                      {member.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-4 py-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="h-4 w-4 mr-2" />
          <span>Team View Mode</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default TeamSidebar;
