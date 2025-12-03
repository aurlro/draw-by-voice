import { z } from 'zod'

/**
 * Schéma Zod pour le type de nœud
 */
export const NodeTypeSchema = z.enum(['user', 'server', 'database', 'decision', 'step'])

/**
 * Schéma Zod pour un nœud de diagramme
 */
export const DiagramNodeSchema = z.object({
    id: z.string().min(1, 'Node ID cannot be empty'),
    label: z.string().min(1, 'Node label cannot be empty'),
    type: NodeTypeSchema,
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
    explanation: z.string().min(1, 'Explanation cannot be empty'),
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
