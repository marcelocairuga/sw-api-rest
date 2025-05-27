import { z } from "zod";

export const userSchema = z.object({
   id: z.string().uuid("User ID must be a valid UUID."),

   name: z.string()
      .min(3, "Name must have at least 3 characters")
      .max(50, "Name must have at most 50 characters"),

   email: z.string().email("Email is not a valid email"),

   password: z.string()
      .min(6, "Password must have at least 6 characters")
      .max(20, "Password must have at most 20 characters")
      .regex(
         /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).+$/,
         "Password must contain at least one letter, one number, and one special character."
      ),

   role: z.enum(["admin", "user"])
      .refine((val) => ["admin", "user"].includes(val), {
         message: "Role must be admin ou user"
      })
});

export const createUserSchema = userSchema
   .omit({ id: true })
   .extend({
      role: userSchema.shape.role.optional().default("user"),
   });

export const updateUserSchema = createUserSchema.partial();

export const registerUserSchema = userSchema.pick({
  name: true,
  email: true, 
  password: true
});