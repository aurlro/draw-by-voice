import { z } from 'zod'

<<<<<<< HEAD
/**
 * Zod schema for environment variables validation.
 * Ensures that necessary environment variables are present and correctly typed.
 */
const envSchema = z.object({
    /** The API key for OpenAI. Required for the application to function. */
    OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
    /** The current environment (development, production, or test). Defaults to 'development'. */
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

/**
 * Validated environment variables object.
 * Throws an error if validation fails.
 */
=======
const envSchema = z.object({
    OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

>>>>>>> origin/enhance-diagram-visuals-bindings
export const env = envSchema.parse(process.env)
