
import { useState } from "react";
import { User, Users } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface TeamSidebarProps {
  onSelectMember: (member: TeamMember) => void;
  onSwitchUser: (member: TeamMember) => void;
  selectedMemberId?: number;
  currentUserId: number;
}

const TeamSidebar = ({ 
  onSelectMember, 
  onSwitchUser,
  selectedMemberId, 
  currentUserId 
}: TeamSidebarProps) => {
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
                  className="flex justify-between"
                >
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">
                        {member.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                  {member.id === currentUserId && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                      You
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Switch User</SidebarGroupLabel>
          <SidebarMenu>
            {members.map((member) => (
              <SidebarMenuItem key={`switch-${member.id}`}>
                <SidebarMenuButton
                  isActive={currentUserId === member.id}
                  onClick={() => onSwitchUser(member)}
                  tooltip="Switch to this user"
                  className={cn(
                    "text-xs",
                    currentUserId === member.id && "font-medium"
                  )}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Login as {member.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-4 py-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          <span>Team View Mode</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default TeamSidebar;
