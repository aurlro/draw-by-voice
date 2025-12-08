// Feature: Diagram - Public Exports

// Components (default exports)
/**
 * TldrawCanvas Component.
 * The main canvas component that renders the Tldraw editor and the diagram.
 */
export { default as TldrawCanvas } from './components/TldrawCanvas'
/**
 * AutoLayoutButton Component.
 * A button to trigger automatic layout of the diagram (for testing purposes).
 */
export { default as AutoLayoutButton } from './components/AutoLayoutButton'
/**
 * DemoButton Component.
 * A button to load and display pre-defined demo diagrams.
 */
export { default as DemoButton } from './components/DemoButton'
/**
 * TestButton Component.
 * A button to add a test shape to the canvas (for testing purposes).
 */
export { default as TestButton } from './components/TestButton'

// Hooks
/**
 * Hook to manage the diagram generation agent.
 */
export { useDiagramAgent } from './hooks/useDiagramAgent'

// Lib
/**
 * Function to generate a diagram on the Tldraw editor from DiagramData.
 */
export { generateDiagram } from './lib/diagramGenerator'
/**
 * Function to calculate automatic layout for nodes and edges.
 */
export { autoLayout } from './lib/autoLayout'
/**
 * Configuration and helper for mapping node types to visual styles.
 */
export { NODE_TYPE_CONFIG, getNodeConfig } from './lib/nodeTypeMapping'
/**
 * Mock data for diagrams used in demos and testing.
 */
export { MOCK_DIAGRAMS } from './lib/mockData'
