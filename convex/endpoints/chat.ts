import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { todoAssistant } from "../agents/todoAssistant";

/**
 * Send a message to the AI assistant
 *
 * Creates a conversation turn and gets AI response using the agent.
 */
export const sendMessage = mutation({
  args: {
    userId: v.id("users"),
    message: v.string(),
    conversationId: v.optional(v.id("conversations"))
  },
  handler: async (ctx, args) => {
    // Create conversation if doesn't exist
    let conversationId = args.conversationId;
    if (!conversationId) {
      conversationId = await ctx.db.insert("conversations", {
        userId: args.userId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    // Save user message
    const userMessageId = await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "user",
      content: args.message,
      timestamp: Date.now()
    });

    // Get conversation history for context
    const history = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .order("desc")
      .take(10);

    // Run agent with context
    const response = await todoAssistant.run(ctx, {
      message: args.message,
      userId: args.userId,
      conversationHistory: history.reverse().map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    // Save assistant response
    const assistantMessageId = await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "assistant",
      content: response.content,
      timestamp: Date.now(),
      toolCalls: response.toolCalls || []
    });

    // Update conversation
    await ctx.db.patch(conversationId, {
      updatedAt: Date.now()
    });

    return {
      conversationId,
      userMessageId,
      assistantMessageId,
      response: response.content,
      toolsUsed: response.toolCalls?.map(t => t.name) || []
    };
  }
});

/**
 * Get conversation history
 */
export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .take(args.limit || 50);

    return messages;
  }
});

/**
 * List user's conversations
 */
export const listConversations = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);

    // Get last message for each conversation
    const withLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .order("desc")
          .first();

        return {
          ...conv,
          lastMessage: lastMessage?.content || "",
          lastMessageAt: lastMessage?.timestamp || conv.updatedAt
        };
      })
    );

    return withLastMessage;
  }
});
