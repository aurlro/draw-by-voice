import { z } from 'zod'

/**
 * Schéma Zod pour le type de nœud
 * Aligné avec les types de géométrie Tldraw (geo shapes)
 */
export const NodeTypeSchema = z.enum([
    // Tldraw geo shapes
    'rectangle',
    'ellipse',
    'diamond',
    'cloud',
    // Types spéciaux pour icônes et acteurs
    'icon',    // Logos externes via CDN (AWS, Docker, etc.)
    'actor',   // Acteurs/utilisateurs (stick figure)
    // Types entités (Architecture)
    'mobile',
    'person',
    'payment',
    // Anciens types abstraits, conservés pour compatibilité
    'user',
    'server',
    'database',
    'decision',
    'step'
]).default('rectangle')

/**
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
    y: z.number().default(0),
})

/**
 * Schéma Zod pour une arête de diagramme
 */
export const DiagramEdgeSchema = z.object({
    source: z.string().min(1, 'Edge source cannot be empty'),
    target: z.string().min(1, 'Edge target cannot be empty'),
    label: z.string().optional(),
})

/**
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
    explanation: z.string().min(1, 'Explanation cannot be empty'),
})

/**
 * Types TypeScript inférés depuis les schémas Zod
 */
export type NodeType = z.infer<typeof NodeTypeSchema>
export type DiagramNode = z.infer<typeof DiagramNodeSchema>
export type DiagramEdge = z.infer<typeof DiagramEdgeSchema>
export type DiagramData = z.infer<typeof DiagramDataSchema>
export type GenerateDiagramArgs = z.infer<typeof GenerateDiagramArgsSchema>
