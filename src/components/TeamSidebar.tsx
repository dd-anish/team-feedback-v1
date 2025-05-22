
import { useState } from "react";
import { User, Users, Plus, Edit, Trash2, Filter } from "lucide-react";
import { TeamMember, getTeamMembers, saveTeamMember, deleteTeamMember, getTeams } from "@/models/teamMember";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamSidebarProps {
  onSelectMember: (member: TeamMember) => void;
  onSwitchUser: (member: TeamMember) => void;
  selectedMemberId?: number;
  currentUserId: number;
}

interface MemberDialogState {
  open: boolean;
  mode: 'add' | 'edit';
  member?: TeamMember;
}

const TeamSidebar = ({ 
  onSelectMember, 
  onSwitchUser,
  selectedMemberId, 
  currentUserId 
}: TeamSidebarProps) => {
  const [members, setMembers] = useState<TeamMember[]>(getTeamMembers());
  const [dialogState, setDialogState] = useState<MemberDialogState>({ open: false, mode: 'add' });
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<string>("");
  const [newMemberTeam, setNewMemberTeam] = useState<string>("");
  const [newMemberIsAdmin, setNewMemberIsAdmin] = useState<boolean>(false);
  const [newMemberIsSuperAdmin, setNewMemberIsSuperAdmin] = useState<boolean>(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("All Teams");
  
  const currentUser = members.find(m => m.id === currentUserId) || members[0];
  const isCurrentUserAdmin = currentUser?.isAdmin || false;
  const isCurrentUserSuperAdmin = currentUser?.isSuperAdmin || false;
  const teams = ["All Teams", ...getTeams()];

  // Filter members based on role and team
  const filteredMembers = members.filter(member => {
    // Team filter
    if (selectedTeamFilter !== "All Teams" && member.team !== selectedTeamFilter) {
      return false;
    }
    
    // Role filter - not admin and not super admin
    return !member.isAdmin;
  });

  // Filtered admins (admins but not super admins)
  const filteredAdmins = members.filter(member => {
    // Team filter
    if (selectedTeamFilter !== "All Teams" && member.team !== selectedTeamFilter) {
      return false;
    }
    
    // Role filter - admin but not super admin
    return member.isAdmin && !member.isSuperAdmin;
  });

  // Filtered super admins
  const filteredSuperAdmins = members.filter(member => {
    // Team filter
    if (selectedTeamFilter !== "All Teams" && member.team !== selectedTeamFilter) {
      return false;
    }
    
    // Role filter - super admin
    return member.isSuperAdmin;
  });

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      if (dialogState.mode === 'add') {
        // Adding new member
        const newMember: TeamMember = {
          id: Date.now(),
          name: newMemberName.trim(),
          role: newMemberRole.trim(),
          team: newMemberTeam || "Unassigned",
          avatarInitials: newMemberName
            .split(" ")
            .map(part => part[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
          isAdmin: newMemberIsAdmin,
          isSuperAdmin: newMemberIsSuperAdmin
        };
        
        saveTeamMember(newMember);
        setMembers([...members, newMember]);
        toast({
          title: "Team member added",
          description: `${newMember.name} has been added to the team.`
        });
      } else {
        // Editing existing member
        const updatedMember = {
          ...dialogState.member!,
          name: newMemberName.trim(),
          role: newMemberRole.trim(),
          team: newMemberTeam || "Unassigned",
          isAdmin: newMemberIsAdmin,
          isSuperAdmin: newMemberIsSuperAdmin,
          avatarInitials: newMemberName
            .split(" ")
            .map(part => part[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
        };
        
        saveTeamMember(updatedMember);
        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
        toast({
          title: "Team member updated",
          description: `${updatedMember.name}'s information has been updated.`
        });
      }
      
      // Reset form
      resetForm();
    }
  };

  const handleDeleteMember = (id: number) => {
    const memberToDelete = members.find(m => m.id === id);
    if (memberToDelete) {
      deleteTeamMember(id);
      setMembers(members.filter(m => m.id !== id));
      toast({
        title: "Team member removed",
        description: `${memberToDelete.name} has been removed from the team.`
      });
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setDialogState({ open: true, mode: 'edit', member });
    setNewMemberName(member.name);
    setNewMemberRole(member.role);
    setNewMemberTeam(member.team || "Unassigned");
    setNewMemberIsAdmin(member.isAdmin);
    setNewMemberIsSuperAdmin(member.isSuperAdmin || false);
  };

  const resetForm = () => {
    setDialogState({ open: false, mode: 'add' });
    setNewMemberName("");
    setNewMemberRole("");
    setNewMemberTeam("");
    setNewMemberIsAdmin(false);
    setNewMemberIsSuperAdmin(false);
  };

  const canManageMember = (member: TeamMember): boolean => {
    // Super admins can manage anyone except themselves
    if (isCurrentUserSuperAdmin && currentUserId !== member.id) {
      return true;
    }
    
    // Regular admins can manage regular members but not other admins or super admins
    if (isCurrentUserAdmin && !isCurrentUserSuperAdmin && !member.isAdmin && !member.isSuperAdmin) {
      return true;
    }
    
    return false;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Team Feedback</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-3 py-2">
          <div className="flex items-center mb-2">
            <Filter className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Filter by Team</span>
          </div>
          <Select value={selectedTeamFilter} onValueChange={setSelectedTeamFilter}>
            <SelectTrigger className="w-full mb-3">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Team Members</SidebarGroupLabel>
          {(isCurrentUserAdmin || isCurrentUserSuperAdmin) && (
            <SidebarGroupAction onClick={() => setDialogState({ open: true, mode: 'add' })}>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
          )}
          <SidebarMenu>
            {filteredMembers.map((member) => (
              <SidebarMenuItem key={`member-${member.id}`}>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton 
                    isActive={selectedMemberId === member.id}
                    onClick={() => onSelectMember(member)}
                    tooltip={`${member.role} - ${member.team}`}
                    className="flex-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {member.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                      <div className="flex items-center">
                        {member.team && (
                          <span className="mr-2 text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                            {member.team}
                          </span>
                        )}
                        {member.id === currentUserId && (
                          <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </SidebarMenuButton>
                  
                  {canManageMember(member) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMember(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteMember(member.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          {isCurrentUserSuperAdmin && (
            <SidebarGroupAction onClick={() => {
              setDialogState({ open: true, mode: 'add' });
              setNewMemberIsAdmin(true);
            }}>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
          )}
          <SidebarMenu>
            {filteredAdmins.map((admin) => (
              <SidebarMenuItem key={`admin-${admin.id}`}>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton 
                    isActive={selectedMemberId === admin.id}
                    onClick={() => onSelectMember(admin)}
                    tooltip={admin.role}
                    className="flex-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {admin.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{admin.name}</span>
                      </div>
                      {admin.id === currentUserId && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                          You
                        </span>
                      )}
                    </div>
                  </SidebarMenuButton>
                  
                  {isCurrentUserSuperAdmin && admin.id !== currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMember(admin)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteMember(admin.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        {/* Super Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
          {isCurrentUserSuperAdmin && (
            <SidebarGroupAction onClick={() => {
              setDialogState({ open: true, mode: 'add' });
              setNewMemberIsAdmin(true);
              setNewMemberIsSuperAdmin(true);
            }}>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
          )}
          <SidebarMenu>
            {filteredSuperAdmins.map((superAdmin) => (
              <SidebarMenuItem key={`superAdmin-${superAdmin.id}`}>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton 
                    isActive={selectedMemberId === superAdmin.id}
                    onClick={() => onSelectMember(superAdmin)}
                    tooltip={superAdmin.role}
                    className="flex-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {superAdmin.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{superAdmin.name}</span>
                      </div>
                      {superAdmin.id === currentUserId && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                          You
                        </span>
                      )}
                    </div>
                  </SidebarMenuButton>
                  
                  {isCurrentUserSuperAdmin && superAdmin.id !== currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMember(superAdmin)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteMember(superAdmin.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
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

      <Dialog open={dialogState.open} onOpenChange={(open) => {
        if (!open) resetForm();
        else setDialogState({...dialogState, open});
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
            </DialogTitle>
            <DialogDescription>
              {dialogState.mode === 'add' 
                ? 'Add a new team member to the system.'
                : 'Update team member information.'}
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
            <div className="grid gap-2">
              <Label htmlFor="team">Team</Label>
              <Input 
                id="team" 
                value={newMemberTeam} 
                onChange={(e) => setNewMemberTeam(e.target.value)} 
                placeholder="Team 1"
              />
            </div>
            
            {(isCurrentUserAdmin || isCurrentUserSuperAdmin) && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is-admin" 
                  checked={newMemberIsAdmin}
                  onCheckedChange={(checked) => {
                    const isChecked = !!checked;
                    setNewMemberIsAdmin(isChecked);
                    if (!isChecked) setNewMemberIsSuperAdmin(false);
                  }}
                />
                <Label htmlFor="is-admin">Is admin</Label>
              </div>
            )}
            
            {isCurrentUserSuperAdmin && newMemberIsAdmin && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is-super-admin" 
                  checked={newMemberIsSuperAdmin}
                  onCheckedChange={(checked) => setNewMemberIsSuperAdmin(!!checked)}
                />
                <Label htmlFor="is-super-admin">Is super admin</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={resetForm} variant="outline">Cancel</Button>
            <Button onClick={handleAddMember}>
              {dialogState.mode === 'add' ? 'Add Member' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
};

export default TeamSidebar;
