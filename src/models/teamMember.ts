
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatarInitials: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  team?: string;
}

// Sample team members data
const defaultTeamMembers: TeamMember[] = [
  { id: 1, name: "Alex Johnson", role: "Product Manager", avatarInitials: "AJ", isAdmin: false, team: "Team 1" },
  { id: 2, name: "Samantha Lee", role: "UX Designer", avatarInitials: "SL", isAdmin: false, team: "Team 1" },
  { id: 3, name: "Marcus Chen", role: "Developer", avatarInitials: "MC", isAdmin: false, team: "Team 2" },
  { id: 4, name: "Priya Patel", role: "Marketing Lead", avatarInitials: "PP", isAdmin: false, team: "Team 2" },
  { id: 5, name: "James Wilson", role: "Data Analyst", avatarInitials: "JW", isAdmin: false, team: "Team 3" },
  { id: 6, name: "Anish", role: "Admin", avatarInitials: "AN", isAdmin: true, team: "Admin" },
  { id: 7, name: "Super Anish", role: "Super Admin", avatarInitials: "SA", isAdmin: true, isSuperAdmin: true, team: "Super Admin" },
];

// Clear any existing data to start fresh
const resetTeamMembers = (): void => {
  localStorage.removeItem("teamMembers");
  localStorage.removeItem("feedbackList");
};

// Helper functions to work with localStorage
export const getTeamMembers = (): TeamMember[] => {
  try {
    // Check if we should initialize with default data
    if (!localStorage.getItem("initializedTeamMembers")) {
      resetTeamMembers();
      localStorage.setItem("teamMembers", JSON.stringify(defaultTeamMembers));
      localStorage.setItem("initializedTeamMembers", "true");
      return defaultTeamMembers;
    }
    
    const storedMembers = localStorage.getItem("teamMembers");
    return storedMembers ? JSON.parse(storedMembers) : defaultTeamMembers;
  } catch (error) {
    console.error("Error retrieving team members:", error);
    return defaultTeamMembers;
  }
};

export const saveTeamMember = (member: TeamMember): void => {
  try {
    const members = getTeamMembers();
    const existingIndex = members.findIndex((m) => m.id === member.id);
    
    if (existingIndex >= 0) {
      members[existingIndex] = member;
    } else {
      member.id = Date.now();
      // Generate avatar initials from the name
      member.avatarInitials = member.name
        .split(" ")
        .map(part => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
      members.push(member);
    }
    
    localStorage.setItem("teamMembers", JSON.stringify(members));
  } catch (error) {
    console.error("Error saving team member:", error);
  }
};

export const deleteTeamMember = (id: number): void => {
  try {
    const members = getTeamMembers();
    const updatedMembers = members.filter(member => member.id !== id);
    localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
  } catch (error) {
    console.error("Error deleting team member:", error);
  }
};

export const getTeams = (): string[] => {
  try {
    const members = getTeamMembers();
    const teams = Array.from(new Set(members.map(member => member.team || "Unassigned")));
    return teams;
  } catch (error) {
    console.error("Error getting teams:", error);
    return ["Unassigned"];
  }
};
