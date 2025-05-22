
import { useState } from "react";
import { User, Users, Plus } from "lucide-react";
import { TeamMember, getTeamMembers, saveTeamMember } from "@/models/teamMember";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroupAction
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

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
  const [members, setMembers] = useState<TeamMember[]>(getTeamMembers());
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<string>("");
  const [newMemberIsAdmin, setNewMemberIsAdmin] = useState<boolean>(false);
  
  const currentUser = members.find(m => m.id === currentUserId) || members[0];
  const isCurrentUserAdmin = currentUser?.isAdmin || false;

  // Filter members into regular team members and admins
  const teamMembers = members.filter(member => !member.isAdmin);
  const admins = members.filter(member => member.isAdmin);

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      const newMember: TeamMember = {
        id: Date.now(),
        name: newMemberName.trim(),
        role: newMemberRole.trim(),
        avatarInitials: newMemberName
          .split(" ")
          .map(part => part[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
        isAdmin: newMemberIsAdmin
      };
      
      saveTeamMember(newMember);
      setMembers([...members, newMember]);
      setNewMemberName("");
      setNewMemberRole("");
      setNewMemberIsAdmin(false);
      setOpenDialog(false);
      
      toast({
        title: "Team member added",
        description: `${newMember.name} has been added to the team.`
      });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Team Feedback</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Team Members</SidebarGroupLabel>
          {isCurrentUserAdmin && (
            <SidebarGroupAction onClick={() => setOpenDialog(true)}>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
          )}
          <SidebarMenu>
            {teamMembers.map((member) => (
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
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          {isCurrentUserAdmin && (
            <SidebarGroupAction onClick={() => setOpenDialog(true)}>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
          )}
          <SidebarMenu>
            {admins.map((admin) => (
              <SidebarMenuItem key={admin.id}>
                <SidebarMenuButton 
                  isActive={selectedMemberId === admin.id}
                  onClick={() => onSelectMember(admin)}
                  tooltip={admin.role}
                  className="flex justify-between"
                >
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">
                        {admin.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span>{admin.name}</span>
                  </div>
                  {admin.id === currentUserId && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                      You
                    </span>
                  )}
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member or admin to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newMemberName} 
                onChange={(e) => setNewMemberName(e.target.value)} 
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input 
                id="role" 
                value={newMemberRole} 
                onChange={(e) => setNewMemberRole(e.target.value)} 
                placeholder="Developer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is-admin" 
                checked={newMemberIsAdmin}
                onCheckedChange={(checked) => setNewMemberIsAdmin(!!checked)}
              />
              <Label htmlFor="is-admin">Is admin</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)} variant="outline">Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
};

export default TeamSidebar;
