
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatarInitials: string;
  isAdmin: boolean;
}

// Sample team members data
const defaultTeamMembers: TeamMember[] = [
  { id: 1, name: "Alex Johnson", role: "Product Manager", avatarInitials: "AJ", isAdmin: false },
  { id: 2, name: "Samantha Lee", role: "UX Designer", avatarInitials: "SL", isAdmin: false },
  { id: 3, name: "Marcus Chen", role: "Developer", avatarInitials: "MC", isAdmin: false },
  { id: 4, name: "Priya Patel", role: "Marketing Lead", avatarInitials: "PP", isAdmin: false },
  { id: 5, name: "James Wilson", role: "Data Analyst", avatarInitials: "JW", isAdmin: false },
  { id: 6, name: "Anish", role: "Admin", avatarInitials: "AN", isAdmin: true },
];

// Helper functions to work with localStorage
export const getTeamMembers = (): TeamMember[] => {
  try {
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
