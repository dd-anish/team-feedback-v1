
import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackList from "@/components/FeedbackList";
import TeamSidebar from "@/components/TeamSidebar";
import TeamMemberProfile from "@/components/TeamMemberProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { TeamMember, getTeamMembers } from "@/models/teamMember";
import { getFeedbackList } from "@/models/feedback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [activeTab, setActiveTab] = useState("give-feedback");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [allMembers] = useState<TeamMember[]>(getTeamMembers());
  const [currentUser, setCurrentUser] = useState<TeamMember>(
    allMembers.find(m => m.isAdmin) || allMembers[0]
  );
  
  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
    setActiveTab("member-view");
  };

  const handleSwitchCurrentUser = (member: TeamMember) => {
    setCurrentUser(member);
    toast({
      title: "User Switched",
      description: `You are now logged in as ${member.name}`,
    });
  };

  // Filter feedback based on user permissions
  const myFeedback = getFeedbackList().filter(
    (item) => item.recipientName === currentUser.name
  );

  // For admins, get all feedback
  const allFeedback = currentUser.isAdmin ? getFeedbackList() : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">TeamFeedback</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2 text-primary-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary-foreground text-primary">
                    {currentUser.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <span>{currentUser.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Switch User</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {allMembers.filter(m => !m.isAdmin).length > 0 && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Team Members
                  </DropdownMenuLabel>
                  {allMembers
                    .filter(m => !m.isAdmin)
                    .map(member => (
                      <DropdownMenuItem 
                        key={member.id}
                        onClick={() => handleSwitchCurrentUser(member)}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>{member.name}</span>
                      </DropdownMenuItem>
                    ))
                  }
                </DropdownMenuGroup>
              )}
              
              {allMembers.filter(m => m.isAdmin).length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Admins
                    </DropdownMenuLabel>
                    {allMembers
                      .filter(m => m.isAdmin)
                      .map(admin => (
                        <DropdownMenuItem 
                          key={admin.id}
                          onClick={() => handleSwitchCurrentUser(admin)}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>{admin.name}</span>
                        </DropdownMenuItem>
                      ))
                    }
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-primary-foreground"
            onClick={() => toast({
              title: "Notifications",
              description: "You have no new notifications",
            })}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
          <TeamSidebar 
            onSelectMember={handleSelectMember}
            onSwitchUser={handleSwitchCurrentUser}
            selectedMemberId={selectedMember?.id}
            currentUserId={currentUser.id}
          />
          <SidebarInset>
            <main className="container mx-auto py-8 px-4 md:px-6 flex-grow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <SidebarTrigger className="md:inline-flex" />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="give-feedback">
                    Give Feedback
                  </TabsTrigger>
                  <TabsTrigger value="my-feedback">
                    My Feedback
                  </TabsTrigger>
                  <TabsTrigger value="member-view" disabled={!selectedMember}>
                    {selectedMember ? `${selectedMember.name}'s Profile` : "Select Member"}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="give-feedback">
                  <div className="bg-card rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6">Give Feedback to Team Member</h2>
                    <FeedbackForm currentUser={currentUser} />
                  </div>
                </TabsContent>
                
                <TabsContent value="my-feedback">
                  <div className="bg-card rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6">
                      {currentUser.isAdmin ? "All Feedback" : "Feedback Received"}
                    </h2>
                    <FeedbackList 
                      feedbackItems={currentUser.isAdmin ? allFeedback : myFeedback} 
                      loading={false} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="member-view">
                  {selectedMember && (
                    <TeamMemberProfile 
                      member={selectedMember} 
                      currentUser={currentUser}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <footer className="bg-muted py-4 px-6 text-center text-sm text-muted-foreground">
        <p>© 2025 TeamFeedback. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
