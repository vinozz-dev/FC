import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(), // student, entrepreneur, wantrepreneur, mentor, investor, institution
  bio: text("bio"),
  skills: text("skills").array(),
  profileImage: text("profile_image"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  fundingGoal: decimal("funding_goal", { precision: 10, scale: 2 }),
  fundingRaised: decimal("funding_raised", { precision: 10, scale: 2 }).default("0"),
  deadline: timestamp("deadline"),
  image: text("image"),
  tags: text("tags").array(),
  creatorId: integer("creator_id").references(() => users.id),
  status: text("status").default("active"), // active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  expertise: text("expertise").array(),
  experience: text("experience").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  available: boolean("available").default(true),
});

export const mentorships = pgTable("mentorships", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => mentors.id),
  menteeId: integer("mentee_id").references(() => users.id),
  status: text("status").default("pending"), // pending, active, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  available: boolean("available").default(true),
  ownerId: integer("owner_id").references(() => users.id),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resourceRequests = pgTable("resource_requests", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").references(() => resources.id),
  requesterId: integer("requester_id").references(() => users.id),
  status: text("status").default("pending"), // pending, approved, rejected, returned
  requestedAt: timestamp("requested_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  participantCount: integer("participant_count").default(0),
  maxParticipants: integer("max_participants"),
  image: text("image"),
  organizerId: integer("organizer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  userId: integer("user_id").references(() => users.id),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const reels = pgTable("reels", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  media: text("media").notNull(), // URL to video/image
  mediaType: text("media_type").notNull(), // video, image
  authorId: integer("author_id").references(() => users.id),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reelLikes = pgTable("reel_likes", {
  id: serial("id").primaryKey(),
  reelId: integer("reel_id").references(() => reels.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reelComments = pgTable("reel_comments", {
  id: serial("id").primaryKey(),
  reelId: integer("reel_id").references(() => reels.id),
  userId: integer("user_id").references(() => users.id),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fundings = pgTable("fundings", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  investorId: integer("investor_id").references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collaborations = pgTable("collaborations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  userId: integer("user_id").references(() => users.id),
  role: text("role").notNull(),
  status: text("status").default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  fundingRaised: true,
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
  rating: true,
  totalReviews: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  participantCount: true,
});

export const insertReelSchema = createInsertSchema(reels).omit({
  id: true,
  createdAt: true,
  likes: true,
  comments: true,
  shares: true,
});

export const insertFundingSchema = createInsertSchema(fundings).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Mentor = typeof mentors.$inferSelect;
export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Reel = typeof reels.$inferSelect;
export type InsertReel = z.infer<typeof insertReelSchema>;
export type Funding = typeof fundings.$inferSelect;
export type InsertFunding = z.infer<typeof insertFundingSchema>;
export type Collaboration = typeof collaborations.$inferSelect;
export type Mentorship = typeof mentorships.$inferSelect;
export type ResourceRequest = typeof resourceRequests.$inferSelect;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type ReelLike = typeof reelLikes.$inferSelect;
export type ReelComment = typeof reelComments.$inferSelect;
