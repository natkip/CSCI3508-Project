import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

// Pet schema
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(), // dog, cat, rabbit, etc.
  breed: text("breed"),
  age: text("age"), // baby, young, adult, senior
  gender: text("gender"), // male, female
  size: text("size"), // small, medium, large, xlarge
  description: text("description"),
  location: text("location"),
  imageUrl: text("image_url"),
  goodWithKids: boolean("good_with_kids"),
  goodWithDogs: boolean("good_with_dogs"),
  goodWithCats: boolean("good_with_cats"),
  characteristics: text("characteristics").array(), // friendly, playful, etc
  adoptionStatus: text("adoption_status").default("available").notNull(), // available, pending, adopted
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;

// Extended schema for frontend validation
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const filterPetsSchema = z.object({
  search: z.string().optional(),
  species: z.string().optional(),
  location: z.string().optional(),
  age: z.union([z.array(z.string()), z.string().transform(v => [v])]).optional(),
  size: z.union([z.array(z.string()), z.string().transform(v => [v])]).optional(),
  gender: z.union([z.array(z.string()), z.string().transform(v => [v])]).optional(),
  goodWith: z.union([z.array(z.string()), z.string().transform(v => [v])]).optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type FilterPetsData = z.infer<typeof filterPetsSchema>;
