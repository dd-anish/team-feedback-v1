
import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackList from "@/components/FeedbackList";
import TeamSidebar from "@/components/TeamSidebar";
import TeamMemberProfile from "@/components/TeamMemberProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { TeamMember, getTeamMembers } from "@/models/teamMember";

const Index = () => {
  const [activeTab, setActiveTab] = useState("give-feedback");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
    setActiveTab("member-view");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">TeamFeedback</h1>
        <div className="flex items-center gap-4">
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
            selectedMemberId={selectedMember?.id}
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
                    <FeedbackForm />
                  </div>
                </TabsContent>
                
                <TabsContent value="my-feedback">
                  <div className="bg-card rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6">Feedback Received</h2>
                    <FeedbackList />
                  </div>
                </TabsContent>

                <TabsContent value="member-view">
                  {selectedMember && (
                    <TeamMemberProfile member={selectedMember} />
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
