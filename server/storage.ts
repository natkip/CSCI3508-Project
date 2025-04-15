import { users, type User, type InsertUser, pets, type Pet, type InsertPet } from "@shared/schema";
import session from "express-session";
import { db, pool } from "./db";
import { eq, like, ilike, and, or, inArray, isNull, isNotNull } from "drizzle-orm";
import connectPg from "connect-pg-simple";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Pet methods
  getPet(id: number): Promise<Pet | undefined>;
  getAllPets(): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, updates: Partial<Pet>): Promise<Pet | undefined>;
  deletePet(id: number): Promise<boolean>;
  searchPets(filters: {
    search?: string;
    species?: string;
    location?: string;
    age?: string[];
    size?: string[];
    gender?: string[];
    goodWith?: string[];
  }): Promise<Pet[]>;

  // Session store
  sessionStore: session.Store;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session',
    });

    // Create admin user and seed pets if DB is empty
    this.initDatabase();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
    }).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Pet methods
  async getPet(id: number): Promise<Pet | undefined> {
    const result = await db.select().from(pets).where(eq(pets.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllPets(): Promise<Pet[]> {
    return await db.select().from(pets);
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const result = await db.insert(pets).values({
      ...insertPet,
      breed: insertPet.breed || null,
      age: insertPet.age || null,
      gender: insertPet.gender || null,
      size: insertPet.size || null,
      description: insertPet.description || null,
      location: insertPet.location || null,
      imageUrl: insertPet.imageUrl || null,
      goodWithKids: insertPet.goodWithKids || false,
      goodWithDogs: insertPet.goodWithDogs || false,
      goodWithCats: insertPet.goodWithCats || false,
      characteristics: insertPet.characteristics || [],
      adoptionStatus: insertPet.adoptionStatus || "available",
    }).returning();
    return result[0];
  }

  async updatePet(id: number, updates: Partial<Pet>): Promise<Pet | undefined> {
    const result = await db
      .update(pets)
      .set(updates)
      .where(eq(pets.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deletePet(id: number): Promise<boolean> {
    const result = await db.delete(pets).where(eq(pets.id, id)).returning();
    return result.length > 0;
  }

  async searchPets(filters: {
    search?: string;
    species?: string;
    location?: string;
    age?: string[];
    size?: string[];
    gender?: string[];
    goodWith?: string[];
  }): Promise<Pet[]> {
    let conditions = [];
    
    // Apply search filter
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          ilike(pets.name, searchTerm),
          ilike(pets.breed || '', searchTerm),
          ilike(pets.species, searchTerm),
          ilike(pets.description || '', searchTerm)
        )
      );
    }
    
    // Apply species filter
    if (filters.species && filters.species !== "") {
      conditions.push(eq(pets.species, filters.species));
    }
    
    // Apply location filter
    if (filters.location && filters.location !== "") {
      conditions.push(ilike(pets.location || '', `%${filters.location}%`));
    }
    
    // Apply age filter
    if (filters.age && filters.age.length > 0) {
      conditions.push(inArray(pets.age, filters.age));
    }
    
    // Apply size filter
    if (filters.size && filters.size.length > 0) {
      conditions.push(inArray(pets.size, filters.size));
    }
    
    // Apply gender filter
    if (filters.gender && filters.gender.length > 0) {
      conditions.push(inArray(pets.gender, filters.gender));
    }
    
    // Apply goodWith filter
    if (filters.goodWith && filters.goodWith.length > 0) {
      const goodWithConditions = [];
      if (filters.goodWith.includes("kids")) {
        goodWithConditions.push(eq(pets.goodWithKids, true));
      }
      if (filters.goodWith.includes("dogs")) {
        goodWithConditions.push(eq(pets.goodWithDogs, true));
      }
      if (filters.goodWith.includes("cats")) {
        goodWithConditions.push(eq(pets.goodWithCats, true));
      }
      if (goodWithConditions.length > 0) {
        conditions.push(and(...goodWithConditions));
      }
    }
    
    if (conditions.length === 0) {
      return await db.select().from(pets);
    }
    
    return await db.select().from(pets).where(and(...conditions));
  }

  private async initDatabase() {
    // Check if we already have users
    const userCount = await db.select().from(users);
    if (userCount.length === 0) {
      // Create admin user
      const adminUser = await this.createUser({
        username: "admin",
        password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8.e7cf3ef4f17c3999a94f2c6f612e8a888e3211", // SHA256 hash of "password"
        email: "admin@pawfinder.com",
        firstName: "Admin",
        lastName: "User",
      });
      await this.updateUser(adminUser.id, { isAdmin: true });
    }

    // Check if we already have pets
    const petCount = await db.select().from(pets);
    if (petCount.length === 0) {
      await this.seedPets();
    }
  }

  // Seed pet data
  private async seedPets() {
    // Dogs
    await this.createPet({
      name: "Max",
      species: "dog",
      breed: "Labrador Retriever",
      age: "adult",
      gender: "male",
      size: "large",
      description: "Max is a friendly and energetic Labrador Retriever who loves to play fetch and go for long walks. He's house trained, knows basic commands, and gets along well with other dogs and children. Max would do best in an active home with a yard where he can run and play.",
      location: "San Francisco, CA",
      imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      characteristics: ["friendly", "energetic", "smart"],
      adoptionStatus: "available",
    });

    await this.createPet({
      name: "Bella",
      species: "dog",
      breed: "Beagle Mix",
      age: "adult",
      gender: "female",
      size: "medium",
      description: "Bella is a sweet beagle mix who loves cuddles and treats. She's great on a leash and enjoys car rides. Bella is house trained and would make a wonderful companion for a family or individual.",
      location: "Denver, CO",
      imageUrl: "https://images.unsplash.com/photo-1583511655826-05700442b372?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      characteristics: ["friendly", "affectionate", "calm"],
      adoptionStatus: "available",
    });

    // Cats
    await this.createPet({
      name: "Luna",
      species: "cat",
      breed: "Domestic Shorthair",
      age: "young",
      gender: "female",
      size: "small",
      description: "Luna is a playful and curious cat who loves to explore. She enjoys interactive toys and window watching. Luna would do best in a home where she gets plenty of attention and playtime.",
      location: "Portland, OR",
      imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: true,
      goodWithDogs: false,
      goodWithCats: true,
      characteristics: ["playful", "curious", "affectionate"],
      adoptionStatus: "available",
    });

    // Rabbit
    await this.createPet({
      name: "Hopper",
      species: "rabbit",
      breed: "Holland Lop",
      age: "young",
      gender: "male",
      size: "small",
      description: "Hopper is a gentle rabbit who enjoys being petted and given treats. He's litter trained and would make a great indoor pet for a calm household.",
      location: "Austin, TX",
      imageUrl: "https://images.unsplash.com/photo-1518796745738-41048802f99a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: true,
      goodWithDogs: false,
      goodWithCats: false,
      characteristics: ["gentle", "curious", "quiet"],
      adoptionStatus: "available",
    });

    // Additional pets
    await this.createPet({
      name: "Rocky",
      species: "dog",
      breed: "German Shepherd",
      age: "young",
      gender: "male",
      size: "large",
      description: "Rocky is an intelligent and loyal German Shepherd. He's great with training and would excel in an active home with experienced dog owners.",
      location: "Chicago, IL",
      imageUrl: "https://images.unsplash.com/photo-1589941013253-f403010298b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      characteristics: ["intelligent", "loyal", "protective"],
      adoptionStatus: "available",
    });

    await this.createPet({
      name: "Whiskers",
      species: "cat",
      breed: "Maine Coon",
      age: "adult",
      gender: "male",
      size: "large",
      description: "Whiskers is a majestic Maine Coon with a gentle personality. He loves lounging and would be perfect for someone looking for a low-energy companion.",
      location: "Seattle, WA",
      imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: true,
      goodWithDogs: false,
      goodWithCats: true,
      characteristics: ["gentle", "quiet", "affectionate"],
      adoptionStatus: "available",
    });

    await this.createPet({
      name: "Daisy",
      species: "rabbit",
      breed: "Netherland Dwarf",
      age: "baby",
      gender: "female",
      size: "small",
      description: "Daisy is an adorable baby rabbit who's still learning and growing. She's full of energy and would be a delightful addition to a patient home.",
      location: "Boston, MA",
      imageUrl: "https://images.unsplash.com/photo-1535241749838-299277b6305f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false,
      characteristics: ["playful", "curious", "energetic"],
      adoptionStatus: "available",
    });

    await this.createPet({
      name: "Charlie",
      species: "dog",
      breed: "Golden Retriever",
      age: "senior",
      gender: "male",
      size: "large",
      description: "Charlie is a sweet senior dog looking for a comfortable home to spend his golden years. He enjoys short walks and lots of cuddle time.",
      location: "Miami, FL",
      imageUrl: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      characteristics: ["gentle", "calm", "loving"],
      adoptionStatus: "available",
    });
  }
}

export const storage = new DatabaseStorage();
