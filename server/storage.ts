import {
  users, projects, mentors, mentorships, resources, resourceRequests,
  events, eventRegistrations, reels, reelLikes, reelComments, fundings, collaborations,
  type User, type InsertUser, type Project, type InsertProject,
  type Mentor, type InsertMentor, type Resource, type InsertResource,
  type Event, type InsertEvent, type Reel, type InsertReel,
  type Funding, type InsertFunding, type Collaboration, type Mentorship,
  type ResourceRequest, type EventRegistration, type ReelLike, type ReelComment
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;

  // Project management
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByCreator(creatorId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Mentor management
  getMentor(id: number): Promise<Mentor | undefined>;
  getMentors(): Promise<Mentor[]>;
  getMentorByUserId(userId: number): Promise<Mentor | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  updateMentor(id: number, updates: Partial<Mentor>): Promise<Mentor>;

  // Mentorship management
  getMentorship(id: number): Promise<Mentorship | undefined>;
  getMentorshipsByMentor(mentorId: number): Promise<Mentorship[]>;
  getMentorshipsByMentee(menteeId: number): Promise<Mentorship[]>;
  createMentorship(mentorship: Omit<Mentorship, 'id' | 'createdAt'>): Promise<Mentorship>;
  updateMentorship(id: number, updates: Partial<Mentorship>): Promise<Mentorship>;

  // Resource management
  getResource(id: number): Promise<Resource | undefined>;
  getResources(): Promise<Resource[]>;
  getResourcesByOwner(ownerId: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, updates: Partial<Resource>): Promise<Resource>;

  // Resource request management
  getResourceRequest(id: number): Promise<ResourceRequest | undefined>;
  getResourceRequestsByRequester(requesterId: number): Promise<ResourceRequest[]>;
  getResourceRequestsByResource(resourceId: number): Promise<ResourceRequest[]>;
  createResourceRequest(request: Omit<ResourceRequest, 'id' | 'requestedAt'>): Promise<ResourceRequest>;
  updateResourceRequest(id: number, updates: Partial<ResourceRequest>): Promise<ResourceRequest>;

  // Event management
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  getEventsByOrganizer(organizerId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, updates: Partial<Event>): Promise<Event>;

  // Event registration management
  getEventRegistration(eventId: number, userId: number): Promise<EventRegistration | undefined>;
  getEventRegistrations(eventId: number): Promise<EventRegistration[]>;
  createEventRegistration(registration: Omit<EventRegistration, 'id' | 'registeredAt'>): Promise<EventRegistration>;
  deleteEventRegistration(eventId: number, userId: number): Promise<void>;

  // Reel management
  getReel(id: number): Promise<Reel | undefined>;
  getReels(): Promise<Reel[]>;
  getReelsByAuthor(authorId: number): Promise<Reel[]>;
  createReel(reel: InsertReel): Promise<Reel>;
  updateReel(id: number, updates: Partial<Reel>): Promise<Reel>;
  deleteReel(id: number): Promise<void>;

  // Reel interaction management
  getReelLike(reelId: number, userId: number): Promise<ReelLike | undefined>;
  createReelLike(reelLike: Omit<ReelLike, 'id' | 'createdAt'>): Promise<ReelLike>;
  deleteReelLike(reelId: number, userId: number): Promise<void>;
  getReelComments(reelId: number): Promise<ReelComment[]>;
  createReelComment(comment: Omit<ReelComment, 'id' | 'createdAt'>): Promise<ReelComment>;

  // Funding management
  getFunding(id: number): Promise<Funding | undefined>;
  getFundingsByProject(projectId: number): Promise<Funding[]>;
  getFundingsByInvestor(investorId: number): Promise<Funding[]>;
  createFunding(funding: InsertFunding): Promise<Funding>;

  // Collaboration management
  getCollaboration(id: number): Promise<Collaboration | undefined>;
  getCollaborationsByProject(projectId: number): Promise<Collaboration[]>;
  getCollaborationsByUser(userId: number): Promise<Collaboration[]>;
  createCollaboration(collaboration: Omit<Collaboration, 'id' | 'createdAt'>): Promise<Collaboration>;
  updateCollaboration(id: number, updates: Partial<Collaboration>): Promise<Collaboration>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private mentors: Map<number, Mentor> = new Map();
  private mentorships: Map<number, Mentorship> = new Map();
  private resources: Map<number, Resource> = new Map();
  private resourceRequests: Map<number, ResourceRequest> = new Map();
  private events: Map<number, Event> = new Map();
  private eventRegistrations: Map<string, EventRegistration> = new Map();
  private reels: Map<number, Reel> = new Map();
  private reelLikes: Map<string, ReelLike> = new Map();
  private reelComments: Map<number, ReelComment> = new Map();
  private fundings: Map<number, Funding> = new Map();
  private collaborations: Map<number, Collaboration> = new Map();

  private currentUserId = 1;
  private currentProjectId = 1;
  private currentMentorId = 1;
  private currentMentorshipId = 1;
  private currentResourceId = 1;
  private currentResourceRequestId = 1;
  private currentEventId = 1;
  private currentEventRegistrationId = 1;
  private currentReelId = 1;
  private currentReelLikeId = 1;
  private currentReelCommentId = 1;
  private currentFundingId = 1;
  private currentCollaborationId = 1;

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Project management
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByCreator(creatorId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.creatorId === creatorId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      fundingRaised: "0",
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error('Project not found');
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  // Mentor management
  async getMentor(id: number): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }

  async getMentors(): Promise<Mentor[]> {
    return Array.from(this.mentors.values());
  }

  async getMentorByUserId(userId: number): Promise<Mentor | undefined> {
    return Array.from(this.mentors.values()).find(mentor => mentor.userId === userId);
  }

  async createMentor(insertMentor: InsertMentor): Promise<Mentor> {
    const id = this.currentMentorId++;
    const mentor: Mentor = {
      ...insertMentor,
      id,
      rating: "0",
      totalReviews: 0,
    };
    this.mentors.set(id, mentor);
    return mentor;
  }

  async updateMentor(id: number, updates: Partial<Mentor>): Promise<Mentor> {
    const mentor = this.mentors.get(id);
    if (!mentor) throw new Error('Mentor not found');
    
    const updatedMentor = { ...mentor, ...updates };
    this.mentors.set(id, updatedMentor);
    return updatedMentor;
  }

  // Mentorship management
  async getMentorship(id: number): Promise<Mentorship | undefined> {
    return this.mentorships.get(id);
  }

  async getMentorshipsByMentor(mentorId: number): Promise<Mentorship[]> {
    return Array.from(this.mentorships.values()).filter(mentorship => mentorship.mentorId === mentorId);
  }

  async getMentorshipsByMentee(menteeId: number): Promise<Mentorship[]> {
    return Array.from(this.mentorships.values()).filter(mentorship => mentorship.menteeId === menteeId);
  }

  async createMentorship(mentorship: Omit<Mentorship, 'id' | 'createdAt'>): Promise<Mentorship> {
    const id = this.currentMentorshipId++;
    const newMentorship: Mentorship = {
      ...mentorship,
      id,
      createdAt: new Date(),
    };
    this.mentorships.set(id, newMentorship);
    return newMentorship;
  }

  async updateMentorship(id: number, updates: Partial<Mentorship>): Promise<Mentorship> {
    const mentorship = this.mentorships.get(id);
    if (!mentorship) throw new Error('Mentorship not found');
    
    const updatedMentorship = { ...mentorship, ...updates };
    this.mentorships.set(id, updatedMentorship);
    return updatedMentorship;
  }

  // Resource management
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByOwner(ownerId: number): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(resource => resource.ownerId === ownerId);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = {
      ...insertResource,
      id,
      createdAt: new Date(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: number, updates: Partial<Resource>): Promise<Resource> {
    const resource = this.resources.get(id);
    if (!resource) throw new Error('Resource not found');
    
    const updatedResource = { ...resource, ...updates };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  // Resource request management
  async getResourceRequest(id: number): Promise<ResourceRequest | undefined> {
    return this.resourceRequests.get(id);
  }

  async getResourceRequestsByRequester(requesterId: number): Promise<ResourceRequest[]> {
    return Array.from(this.resourceRequests.values()).filter(request => request.requesterId === requesterId);
  }

  async getResourceRequestsByResource(resourceId: number): Promise<ResourceRequest[]> {
    return Array.from(this.resourceRequests.values()).filter(request => request.resourceId === resourceId);
  }

  async createResourceRequest(request: Omit<ResourceRequest, 'id' | 'requestedAt'>): Promise<ResourceRequest> {
    const id = this.currentResourceRequestId++;
    const resourceRequest: ResourceRequest = {
      ...request,
      id,
      requestedAt: new Date(),
    };
    this.resourceRequests.set(id, resourceRequest);
    return resourceRequest;
  }

  async updateResourceRequest(id: number, updates: Partial<ResourceRequest>): Promise<ResourceRequest> {
    const request = this.resourceRequests.get(id);
    if (!request) throw new Error('Resource request not found');
    
    const updatedRequest = { ...request, ...updates };
    this.resourceRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Event management
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.organizerId === organizerId);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = {
      ...insertEvent,
      id,
      participantCount: 0,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event> {
    const event = this.events.get(id);
    if (!event) throw new Error('Event not found');
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // Event registration management
  async getEventRegistration(eventId: number, userId: number): Promise<EventRegistration | undefined> {
    return this.eventRegistrations.get(`${eventId}-${userId}`);
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrations.values()).filter(reg => reg.eventId === eventId);
  }

  async createEventRegistration(registration: Omit<EventRegistration, 'id' | 'registeredAt'>): Promise<EventRegistration> {
    const id = this.currentEventRegistrationId++;
    const eventRegistration: EventRegistration = {
      ...registration,
      id,
      registeredAt: new Date(),
    };
    this.eventRegistrations.set(`${registration.eventId}-${registration.userId}`, eventRegistration);
    return eventRegistration;
  }

  async deleteEventRegistration(eventId: number, userId: number): Promise<void> {
    this.eventRegistrations.delete(`${eventId}-${userId}`);
  }

  // Reel management
  async getReel(id: number): Promise<Reel | undefined> {
    return this.reels.get(id);
  }

  async getReels(): Promise<Reel[]> {
    return Array.from(this.reels.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getReelsByAuthor(authorId: number): Promise<Reel[]> {
    return Array.from(this.reels.values()).filter(reel => reel.authorId === authorId);
  }

  async createReel(insertReel: InsertReel): Promise<Reel> {
    const id = this.currentReelId++;
    const reel: Reel = {
      ...insertReel,
      id,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
    };
    this.reels.set(id, reel);
    return reel;
  }

  async updateReel(id: number, updates: Partial<Reel>): Promise<Reel> {
    const reel = this.reels.get(id);
    if (!reel) throw new Error('Reel not found');
    
    const updatedReel = { ...reel, ...updates };
    this.reels.set(id, updatedReel);
    return updatedReel;
  }

  async deleteReel(id: number): Promise<void> {
    this.reels.delete(id);
  }

  // Reel interaction management
  async getReelLike(reelId: number, userId: number): Promise<ReelLike | undefined> {
    return this.reelLikes.get(`${reelId}-${userId}`);
  }

  async createReelLike(reelLike: Omit<ReelLike, 'id' | 'createdAt'>): Promise<ReelLike> {
    const id = this.currentReelLikeId++;
    const like: ReelLike = {
      ...reelLike,
      id,
      createdAt: new Date(),
    };
    this.reelLikes.set(`${reelLike.reelId}-${reelLike.userId}`, like);
    
    // Update reel likes count
    const reel = this.reels.get(reelLike.reelId);
    if (reel) {
      reel.likes = (reel.likes || 0) + 1;
      this.reels.set(reelLike.reelId, reel);
    }
    
    return like;
  }

  async deleteReelLike(reelId: number, userId: number): Promise<void> {
    this.reelLikes.delete(`${reelId}-${userId}`);
    
    // Update reel likes count
    const reel = this.reels.get(reelId);
    if (reel) {
      reel.likes = Math.max(0, (reel.likes || 0) - 1);
      this.reels.set(reelId, reel);
    }
  }

  async getReelComments(reelId: number): Promise<ReelComment[]> {
    return Array.from(this.reelComments.values()).filter(comment => comment.reelId === reelId);
  }

  async createReelComment(comment: Omit<ReelComment, 'id' | 'createdAt'>): Promise<ReelComment> {
    const id = this.currentReelCommentId++;
    const reelComment: ReelComment = {
      ...comment,
      id,
      createdAt: new Date(),
    };
    this.reelComments.set(id, reelComment);
    
    // Update reel comments count
    const reel = this.reels.get(comment.reelId);
    if (reel) {
      reel.comments = (reel.comments || 0) + 1;
      this.reels.set(comment.reelId, reel);
    }
    
    return reelComment;
  }

  // Funding management
  async getFunding(id: number): Promise<Funding | undefined> {
    return this.fundings.get(id);
  }

  async getFundingsByProject(projectId: number): Promise<Funding[]> {
    return Array.from(this.fundings.values()).filter(funding => funding.projectId === projectId);
  }

  async getFundingsByInvestor(investorId: number): Promise<Funding[]> {
    return Array.from(this.fundings.values()).filter(funding => funding.investorId === investorId);
  }

  async createFunding(insertFunding: InsertFunding): Promise<Funding> {
    const id = this.currentFundingId++;
    const funding: Funding = {
      ...insertFunding,
      id,
      createdAt: new Date(),
    };
    this.fundings.set(id, funding);
    
    // Update project funding raised
    const project = this.projects.get(insertFunding.projectId);
    if (project) {
      const currentRaised = parseFloat(project.fundingRaised || "0");
      const newAmount = parseFloat(insertFunding.amount);
      project.fundingRaised = (currentRaised + newAmount).toString();
      this.projects.set(insertFunding.projectId, project);
    }
    
    return funding;
  }

  // Collaboration management
  async getCollaboration(id: number): Promise<Collaboration | undefined> {
    return this.collaborations.get(id);
  }

  async getCollaborationsByProject(projectId: number): Promise<Collaboration[]> {
    return Array.from(this.collaborations.values()).filter(collab => collab.projectId === projectId);
  }

  async getCollaborationsByUser(userId: number): Promise<Collaboration[]> {
    return Array.from(this.collaborations.values()).filter(collab => collab.userId === userId);
  }

  async createCollaboration(collaboration: Omit<Collaboration, 'id' | 'createdAt'>): Promise<Collaboration> {
    const id = this.currentCollaborationId++;
    const newCollaboration: Collaboration = {
      ...collaboration,
      id,
      createdAt: new Date(),
    };
    this.collaborations.set(id, newCollaboration);
    return newCollaboration;
  }

  async updateCollaboration(id: number, updates: Partial<Collaboration>): Promise<Collaboration> {
    const collaboration = this.collaborations.get(id);
    if (!collaboration) throw new Error('Collaboration not found');
    
    const updatedCollaboration = { ...collaboration, ...updates };
    this.collaborations.set(id, updatedCollaboration);
    return updatedCollaboration;
  }
}

export const storage = new MemStorage();
