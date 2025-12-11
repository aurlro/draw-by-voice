import { z } from 'zod'

/**
<<<<<<< HEAD
 * Zod schema for Node Type.
 * Aligned with Tldraw geometry shapes and custom types.
=======
 * Schéma Zod pour le type de nœud
 * Aligné avec les types de géométrie Tldraw (geo shapes)
>>>>>>> origin/enhance-diagram-visuals-bindings
 */
export const NodeTypeSchema = z.enum([
    // Tldraw geo shapes
    'rectangle',
    'ellipse',
    'diamond',
    'cloud',
<<<<<<< HEAD
    // Special types for icons and actors
    'icon',    // External logos via CDN (AWS, Docker, etc.)
    'actor',   // Actors/users (stick figure)
    // Entity types (Architecture)
    'mobile',
    'person',
    'payment',
    // Legacy abstract types, kept for compatibility
=======
    // Types spéciaux pour icônes et acteurs
    'icon',    // Logos externes via CDN (AWS, Docker, etc.)
    'actor',   // Acteurs/utilisateurs (stick figure)
    // Types entités (Architecture)
    'mobile',
    'person',
    'payment',
    // Anciens types abstraits, conservés pour compatibilité
>>>>>>> origin/enhance-diagram-visuals-bindings
    'user',
    'server',
    'database',
    'decision',
    'step'
]).default('rectangle')

/**
<<<<<<< HEAD
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
=======
 * Schéma Zod pour un nœud de diagramme
 */
export const DiagramNodeSchema = z.object({
    id: z.string().min(1, 'Node ID cannot be empty'),
    label: z.string().min(1, 'Node label cannot be empty'),
    type: NodeTypeSchema,
    // Support des icônes externes (SimpleIcons CDN)
    iconName: z.string().optional(), // Slug technique: 'react', 'amazonwebservices', 'docker', etc.
    // Coordonnées optionnelles pour positionnement manuel (défaut 0)
    x: z.number().default(0),
>>>>>>> origin/enhance-diagram-visuals-bindings
    y: z.number().default(0),
})

/**
<<<<<<< HEAD
 * Zod schema for a Diagram Edge.
 * Represents a connection between two nodes.
 */
export const DiagramEdgeSchema = z.object({
    /** The ID of the source node. */
    source: z.string().min(1, 'Edge source cannot be empty'),
    /** The ID of the target node. */
    target: z.string().min(1, 'Edge target cannot be empty'),
    /** Optional label for the connection. */
=======
 * Schéma Zod pour une arête de diagramme
 */
export const DiagramEdgeSchema = z.object({
    source: z.string().min(1, 'Edge source cannot be empty'),
    target: z.string().min(1, 'Edge target cannot be empty'),
>>>>>>> origin/enhance-diagram-visuals-bindings
    label: z.string().optional(),
})

/**
<<<<<<< HEAD
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
=======
 * Schéma Zod complet pour les données du diagramme
 */
export const DiagramDataSchema = z.object({
    nodes: z.array(DiagramNodeSchema).min(1, 'Diagram must have at least one node'),
    edges: z.array(DiagramEdgeSchema),
    explanation: z.string().optional(), // Optional car pas toujours nécessaire
})

/**
 * Schéma pour la réponse de la fonction generate_diagram
 */
export const GenerateDiagramArgsSchema = z.object({
    diagram_data: DiagramDataSchema,
>>>>>>> origin/enhance-diagram-visuals-bindings
    explanation: z.string().min(1, 'Explanation cannot be empty'),
})

/**
<<<<<<< HEAD
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
=======
 * Types TypeScript inférés depuis les schémas Zod
 */
export type NodeType = z.infer<typeof NodeTypeSchema>
export type DiagramNode = z.infer<typeof DiagramNodeSchema>
export type DiagramEdge = z.infer<typeof DiagramEdgeSchema>
export type DiagramData = z.infer<typeof DiagramDataSchema>
>>>>>>> origin/enhance-diagram-visuals-bindings
export type GenerateDiagramArgs = z.infer<typeof GenerateDiagramArgsSchema>
