import { users, type User, type InsertUser, type GameProgress, type Lesson } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProgress(userId: number): Promise<GameProgress[]>;
  saveProgress(progress: GameProgress): Promise<GameProgress>;
  getLessons(teacherId: number): Promise<Lesson[]>;
  createLesson(lesson: Lesson): Promise<Lesson>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private progress: Map<number, GameProgress[]>;
  private lessons: Map<number, Lesson[]>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.progress = new Map();
    this.lessons = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProgress(userId: number): Promise<GameProgress[]> {
    return this.progress.get(userId) || [];
  }

  async saveProgress(progress: GameProgress): Promise<GameProgress> {
    const userProgress = this.progress.get(progress.userId) || [];
    userProgress.push(progress);
    this.progress.set(progress.userId, userProgress);
    return progress;
  }

  async getLessons(teacherId: number): Promise<Lesson[]> {
    return this.lessons.get(teacherId) || [];
  }

  async createLesson(lesson: Lesson): Promise<Lesson> {
    const teacherLessons = this.lessons.get(lesson.teacherId) || [];
    teacherLessons.push(lesson);
    this.lessons.set(lesson.teacherId, teacherLessons);
    return lesson;
  }
}

export const storage = new MemStorage();