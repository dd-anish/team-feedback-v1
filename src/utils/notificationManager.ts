
import { toast } from "@/components/ui/use-toast";
import { Feedback } from "@/models/feedback";

// Function to handle showing notifications for new feedback
export function notifyNewFeedback(feedback: Feedback): void {
  toast({
    title: "New Feedback Received",
    description: `You've received new feedback${
      feedback.isAnonymous ? "" : ` from ${feedback.senderName}`
    }.`,
  });
}

// Store notification preferences
interface NotificationPreferences {
  receiveFeedbackNotifications: boolean;
}

// Get notification preferences from localStorage
export function getNotificationPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem("notificationPreferences");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error getting notification preferences:", error);
  }
  
  // Default preferences
  return {
    receiveFeedbackNotifications: true
  };
}

// Save notification preferences to localStorage
export function saveNotificationPreferences(preferences: NotificationPreferences): void {
  try {
    localStorage.setItem("notificationPreferences", JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving notification preferences:", error);
  }
}
