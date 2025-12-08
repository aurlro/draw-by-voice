import { z } from 'zod'

/**
 * Zod schema for Node Type.
 * Aligned with Tldraw geometry shapes and custom types.
 */
export const NodeTypeSchema = z.enum([
    // Tldraw geo shapes
    'rectangle',
    'ellipse',
    'diamond',
    'cloud',
    // Special types for icons and actors
    'icon',    // External logos via CDN (AWS, Docker, etc.)
    'actor',   // Actors/users (stick figure)
    // Entity types (Architecture)
    'mobile',
    'person',
    'payment',
    // Legacy abstract types, kept for compatibility
    'user',
    'server',
    'database',
    'decision',
    'step'
]).default('rectangle')

/**
 * Zod schema for a Diagram Node.
 * Represents a single node in the diagram graph.
 */
export const DiagramNodeSchema = z.object({
    /** Unique identifier for the node. */
    id: z.string().min(1, 'Node ID cannot be empty'),
    /** Text label displayed on the node. */
    label: z.string().min(1, 'Node label cannot be empty'),
    /** The type of the node (shape/icon). */
    type: NodeTypeSchema,
    /** Optional icon name for external icons (e.g., 'react', 'docker'). */
    iconName: z.string().optional(), // Technical slug: 'react', 'amazonwebservices', 'docker', etc.
    /** X coordinate (default 0). */
    x: z.number().default(0),
    /** Y coordinate (default 0). */
    y: z.number().default(0),
})

/**
 * Zod schema for a Diagram Edge.
 * Represents a connection between two nodes.
 */
export const DiagramEdgeSchema = z.object({
    /** The ID of the source node. */
    source: z.string().min(1, 'Edge source cannot be empty'),
    /** The ID of the target node. */
    target: z.string().min(1, 'Edge target cannot be empty'),
    /** Optional label for the connection. */
    label: z.string().optional(),
})

/**
 * Zod schema for complete Diagram Data.
 * Contains nodes, edges, and an optional explanation.
 */
export const DiagramDataSchema = z.object({
    /** Array of nodes in the diagram. */
    nodes: z.array(DiagramNodeSchema).min(1, 'Diagram must have at least one node'),
    /** Array of edges connecting the nodes. */
    edges: z.array(DiagramEdgeSchema),
    /** Optional explanation of the diagram. */
    explanation: z.string().optional(), // Optional as it is not always necessary
})

/**
 * Zod schema for arguments passed to `generate_diagram` function.
 */
export const GenerateDiagramArgsSchema = z.object({
    /** The generated diagram data. */
    diagram_data: DiagramDataSchema,
    /** A textual explanation of the generated diagram. */
    explanation: z.string().min(1, 'Explanation cannot be empty'),
})

/**
 * TypeScript type inferred from NodeTypeSchema.
 */
export type NodeType = z.infer<typeof NodeTypeSchema>

/**
 * TypeScript type inferred from DiagramNodeSchema.
 */
export type DiagramNode = z.infer<typeof DiagramNodeSchema>

/**
 * TypeScript type inferred from DiagramEdgeSchema.
 */
export type DiagramEdge = z.infer<typeof DiagramEdgeSchema>

/**
 * TypeScript type inferred from DiagramDataSchema.
 */
export type DiagramData = z.infer<typeof DiagramDataSchema>

/**
 * TypeScript type inferred from GenerateDiagramArgsSchema.
 */
export type GenerateDiagramArgs = z.infer<typeof GenerateDiagramArgsSchema>
