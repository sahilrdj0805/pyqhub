import ContactMessage from "../models/ContactMessage.js";

// Create new contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Create message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      data: contactMessage
    });

  } catch (error) {
    console.error("Contact message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again."
    });
  }
};

// Get all contact messages (Admin only)
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages"
    });
  }
};

// Update message status (Admin only)
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    const updateData = { status };
    
    if (adminReply) {
      updateData.adminReply = adminReply;
      updateData.repliedAt = new Date();
      updateData.status = "replied";
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.json({
      success: true,
      message: "Message updated successfully",
      data: message
    });

  } catch (error) {
    console.error("Update message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message"
    });
  }
};

// Delete contact message (Admin only)
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully"
    });

  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message"
    });
  }
};

// Get contact messages stats (Admin only)
export const getContactStats = async (req, res) => {
  try {
    const totalMessages = await ContactMessage.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ status: "unread" });
    const repliedMessages = await ContactMessage.countDocuments({ status: "replied" });
    
    // Recent messages (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMessages = await ContactMessage.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        totalMessages,
        unreadMessages,
        repliedMessages,
        recentMessages
      }
    });

  } catch (error) {
    console.error("Contact stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact stats"
    });
  }
};