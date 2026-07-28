import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertMentorSchema, insertResourceSchema, insertEventSchema, insertReelSchema, insertFundingSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const projectsWithCreators = await Promise.all(
        projects.map(async (project) => {
          const creator = await storage.getUser(project.creatorId!);
          return {
            ...project,
            creator: creator ? { ...creator, password: undefined } : null,
          };
        })
      );
      res.json(projectsWithCreators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", authenticateToken, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({
        ...projectData,
        creatorId: req.user.userId,
      });
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const creator = await storage.getUser(project.creatorId!);
      const fundings = await storage.getFundingsByProject(id);
      
      res.json({
        ...project,
        creator: creator ? { ...creator, password: undefined } : null,
        fundings,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Funding routes
  app.post("/api/fundings", authenticateToken, async (req, res) => {
    try {
      const fundingData = insertFundingSchema.parse(req.body);
      const funding = await storage.createFunding({
        ...fundingData,
        investorId: req.user.userId,
      });
      res.json(funding);
    } catch (error) {
      res.status(400).json({ message: "Invalid funding data" });
    }
  });

  // Mentor routes
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getMentors();
      const mentorsWithUsers = await Promise.all(
        mentors.map(async (mentor) => {
          const user = await storage.getUser(mentor.userId!);
          return {
            ...mentor,
            user: user ? { ...user, password: undefined } : null,
          };
        })
      );
      res.json(mentorsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });

  app.post("/api/mentors", authenticateToken, async (req, res) => {
    try {
      const mentorData = insertMentorSchema.parse(req.body);
      const mentor = await storage.createMentor({
        ...mentorData,
        userId: req.user.userId,
      });
      res.json(mentor);
    } catch (error) {
      res.status(400).json({ message: "Invalid mentor data" });
    }
  });

  // Mentorship routes
  app.post("/api/mentorships", authenticateToken, async (req, res) => {
    try {
      const { mentorId } = req.body;
      const mentorship = await storage.createMentorship({
        mentorId,
        menteeId: req.user.userId,
        status: "pending",
      });
      res.json(mentorship);
    } catch (error) {
      res.status(400).json({ message: "Failed to create mentorship" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getResources();
      const resourcesWithOwners = await Promise.all(
        resources.map(async (resource) => {
          const owner = await storage.getUser(resource.ownerId!);
          return {
            ...resource,
            owner: owner ? { ...owner, password: undefined } : null,
          };
        })
      );
      res.json(resourcesWithOwners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources", authenticateToken, async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource({
        ...resourceData,
        ownerId: req.user.userId,
      });
      res.json(resource);
    } catch (error) {
      res.status(400).json({ message: "Invalid resource data" });
    }
  });

  app.post("/api/resource-requests", authenticateToken, async (req, res) => {
    try {
      const { resourceId } = req.body;
      const request = await storage.createResourceRequest({
        resourceId,
        requesterId: req.user.userId,
        status: "pending",
      });
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to create resource request" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      const eventsWithOrganizers = await Promise.all(
        events.map(async (event) => {
          const organizer = await storage.getUser(event.organizerId!);
          return {
            ...event,
            organizer: organizer ? { ...organizer, password: undefined } : null,
          };
        })
      );
      res.json(eventsWithOrganizers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", authenticateToken, async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent({
        ...eventData,
        organizerId: req.user.userId,
      });
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.post("/api/events/:id/register", authenticateToken, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const registration = await storage.createEventRegistration({
        eventId,
        userId: req.user.userId,
      });
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to register for event" });
    }
  });

  // Reel routes
  app.get("/api/reels", async (req, res) => {
    try {
      const reels = await storage.getReels();
      const reelsWithAuthors = await Promise.all(
        reels.map(async (reel) => {
          const author = await storage.getUser(reel.authorId!);
          return {
            ...reel,
            author: author ? { ...author, password: undefined } : null,
          };
        })
      );
      res.json(reelsWithAuthors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reels" });
    }
  });

  app.post("/api/reels", authenticateToken, async (req, res) => {
    try {
      const reelData = insertReelSchema.parse(req.body);
      const reel = await storage.createReel({
        ...reelData,
        authorId: req.user.userId,
      });
      res.json(reel);
    } catch (error) {
      res.status(400).json({ message: "Invalid reel data" });
    }
  });

  app.post("/api/reels/:id/like", authenticateToken, async (req, res) => {
    try {
      const reelId = parseInt(req.params.id);
      const existingLike = await storage.getReelLike(reelId, req.user.userId);
      
      if (existingLike) {
        await storage.deleteReelLike(reelId, req.user.userId);
        res.json({ liked: false });
      } else {
        await storage.createReelLike({
          reelId,
          userId: req.user.userId,
        });
        res.json({ liked: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  app.post("/api/reels/:id/comment", authenticateToken, async (req, res) => {
    try {
      const reelId = parseInt(req.params.id);
      const { comment } = req.body;
      
      const reelComment = await storage.createReelComment({
        reelId,
        userId: req.user.userId,
        comment,
      });
      res.json(reelComment);
    } catch (error) {
      res.status(400).json({ message: "Failed to add comment" });
    }
  });

  // Collaboration routes
  app.post("/api/collaborations", authenticateToken, async (req, res) => {
    try {
      const { projectId, role } = req.body;
      const collaboration = await storage.createCollaboration({
        projectId,
        userId: req.user.userId,
        role,
        status: "pending",
      });
      res.json(collaboration);
    } catch (error) {
      res.status(400).json({ message: "Failed to create collaboration request" });
    }
  });

  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const projects = await storage.getProjectsByCreator(userId);
      const collaborations = await storage.getCollaborationsByUser(userId);
      const fundings = await storage.getFundingsByInvestor(userId);
      const mentorships = await storage.getMentorshipsByMentee(userId);

      const stats = {
        activeProjects: projects.length,
        fundingRaised: projects.reduce((sum, p) => sum + parseFloat(p.fundingRaised || "0"), 0),
        networkConnections: collaborations.length + mentorships.length,
        hackathonsWon: 0, // This would need additional tracking
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
