import type { DiagramData } from '@shared/types'

/**
<<<<<<< HEAD
 * Mock data for testing the system without a real API.
=======
 * Données mockées pour tester le système sans API réelle
>>>>>>> origin/enhance-diagram-visuals-bindings
 */

export const MOCK_AWS_ARCHITECTURE: DiagramData = {
    nodes: [
        { id: 'user', label: 'User', type: 'user', x: 0, y: 0 },
        { id: 'lb', label: 'Load Balancer', type: 'server', x: 0, y: 0 },
        { id: 'ec2-1', label: 'EC2 Instance 1', type: 'server', x: 0, y: 0 },
        { id: 'ec2-2', label: 'EC2 Instance 2', type: 'server', x: 0, y: 0 },
        { id: 'rds', label: 'RDS Database', type: 'database', x: 0, y: 0 },
    ],
    edges: [
        { source: 'user', target: 'lb', label: 'HTTPS' },
        { source: 'lb', target: 'ec2-1' },
        { source: 'lb', target: 'ec2-2' },
        { source: 'ec2-1', target: 'rds', label: 'SQL' },
        { source: 'ec2-2', target: 'rds', label: 'SQL' },
    ],
    explanation: 'This diagram shows a standard AWS architecture with a Load Balancer distributing traffic to two EC2 instances, which then connect to an RDS database.'
}

export const MOCK_LOGIN_FLOW: DiagramData = {
    nodes: [
        { id: 'user', label: 'User', type: 'user', x: 0, y: 0 },
        { id: 'input', label: 'Enter Credentials', type: 'step', x: 0, y: 0 },
        { id: 'validate', label: 'Validate', type: 'server', x: 0, y: 0 },
        { id: 'check', label: 'Valid?', type: 'decision', x: 0, y: 0 },
        { id: 'success', label: 'Dashboard', type: 'step', x: 0, y: 0 },
        { id: 'error', label: 'Error Message', type: 'step', x: 0, y: 0 },
    ],
    edges: [
        { source: 'user', target: 'input' },
        { source: 'input', target: 'validate' },
        { source: 'validate', target: 'check' },
        { source: 'check', target: 'success', label: 'Yes' },
        { source: 'check', target: 'error', label: 'No' },
    ],
    explanation: 'This flow chart illustrates the user login process, including credential validation and error handling.'
}

export const MOCK_API_ARCHITECTURE: DiagramData = {
    nodes: [
        { id: 'client', label: 'Client App', type: 'user', x: 0, y: 0 },
        { id: 'api', label: 'REST API', type: 'server', x: 0, y: 0 },
        { id: 'auth', label: 'Auth Service', type: 'server', x: 0, y: 0 },
        { id: 'db', label: 'PostgreSQL', type: 'database', x: 0, y: 0 },
        { id: 'cache', label: 'Redis Cache', type: 'database', x: 0, y: 0 },
    ],
    edges: [
        { source: 'client', target: 'api', label: 'HTTP' },
        { source: 'api', target: 'auth', label: 'Token' },
        { source: 'api', target: 'db' },
        { source: 'api', target: 'cache' },
    ],
    explanation: 'A typical API architecture with a client app connecting to a REST API, which uses an Auth Service for security and interacts with PostgreSQL and Redis.'
}

export const MOCK_CICD_PIPELINE: DiagramData = {
    nodes: [
        { id: 'commit', label: 'Git Commit', type: 'step', x: 0, y: 0 },
        { id: 'build', label: 'Build', type: 'step', x: 0, y: 0 },
        { id: 'test', label: 'Run Tests', type: 'step', x: 0, y: 0 },
        { id: 'quality', label: 'Quality Gate', type: 'decision', x: 0, y: 0 },
        { id: 'deploy', label: 'Deploy', type: 'step', x: 0, y: 0 },
        { id: 'rollback', label: 'Rollback', type: 'step', x: 0, y: 0 },
    ],
    edges: [
        { source: 'commit', target: 'build' },
        { source: 'build', target: 'test' },
        { source: 'test', target: 'quality' },
        { source: 'quality', target: 'deploy', label: 'Pass' },
        { source: 'quality', target: 'rollback', label: 'Fail' },
    ],
    explanation: 'A CI/CD pipeline showing the stages from Git Commit to Deployment or Rollback based on quality checks.'
}

/**
<<<<<<< HEAD
 * List of all available mock diagrams.
=======
 * Liste de tous les diagrammes mockés disponibles
>>>>>>> origin/enhance-diagram-visuals-bindings
 */
export const MOCK_DIAGRAMS: Record<string, DiagramData> = {
    'AWS Architecture': MOCK_AWS_ARCHITECTURE,
    'Login Flow': MOCK_LOGIN_FLOW,
    'API Architecture': MOCK_API_ARCHITECTURE,
    'CI/CD Pipeline': MOCK_CICD_PIPELINE,
<<<<<<< HEAD
=======
    'Rich Tech Stack': {
        nodes: [
            { id: 'dev', label: 'Developer', type: 'actor', x: 0, y: 0 },
            { id: 'github', label: 'GitHub', type: 'icon', iconName: 'github', x: 0, y: 0 },
            { id: 'vercel', label: 'Vercel', type: 'icon', iconName: 'vercel', x: 0, y: 0 },
            { id: 'next', label: 'Next.js', type: 'icon', iconName: 'nextdotjs', x: 0, y: 0 },
            { id: 'supabase', label: 'Supabase', type: 'icon', iconName: 'supabase', x: 0, y: 0 },
        ],
        edges: [
            { source: 'dev', target: 'github', label: 'Push' },
            { source: 'github', target: 'vercel', label: 'Trigger Build' },
            { source: 'vercel', target: 'next', label: 'Deploy' },
            { source: 'next', target: 'supabase', label: 'Query' },
        ],
        explanation: 'A modern stack with specific icons: GitHub, Vercel, Next.js and Supabase.'
    },
>>>>>>> origin/enhance-diagram-visuals-bindings
    'Online Purchase Cycle': {
        nodes: [
            { id: 'customer', label: 'Customer', type: 'user', x: 0, y: 0 },
            { id: 'browse', label: 'Browse Products', type: 'step', x: 0, y: 0 },
            { id: 'cart', label: 'Add to Cart', type: 'step', x: 0, y: 0 },
            { id: 'checkout', label: 'Checkout', type: 'step', x: 0, y: 0 },
            { id: 'payment', label: 'Payment Gateway', type: 'server', x: 0, y: 0 },
            { id: 'success', label: 'Order Confirmed', type: 'step', x: 0, y: 0 },
            { id: 'inventory', label: 'Update Inventory', type: 'database', x: 0, y: 0 },
        ],
        edges: [
            { source: 'customer', target: 'browse' },
            { source: 'browse', target: 'cart' },
            { source: 'cart', target: 'checkout' },
            { source: 'checkout', target: 'payment' },
            { source: 'payment', target: 'success', label: 'Approved' },
            { source: 'success', target: 'inventory' },
        ],
        explanation: 'The steps a customer takes to purchase a product, from browsing to payment and inventory update.'
    },
}
