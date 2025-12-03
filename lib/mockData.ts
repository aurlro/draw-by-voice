import type { DiagramData } from '@/types'

/**
 * Données mockées pour tester le système sans API réelle
 */

export const MOCK_AWS_ARCHITECTURE: DiagramData = {
    nodes: [
        { id: 'user', label: 'User', type: 'user' },
        { id: 'lb', label: 'Load Balancer', type: 'server' },
        { id: 'ec2-1', label: 'EC2 Instance 1', type: 'server' },
        { id: 'ec2-2', label: 'EC2 Instance 2', type: 'server' },
        { id: 'rds', label: 'RDS Database', type: 'database' },
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
        { id: 'user', label: 'User', type: 'user' },
        { id: 'input', label: 'Enter Credentials', type: 'step' },
        { id: 'validate', label: 'Validate', type: 'server' },
        { id: 'check', label: 'Valid?', type: 'decision' },
        { id: 'success', label: 'Dashboard', type: 'step' },
        { id: 'error', label: 'Error Message', type: 'step' },
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
        { id: 'client', label: 'Client App', type: 'user' },
        { id: 'api', label: 'REST API', type: 'server' },
        { id: 'auth', label: 'Auth Service', type: 'server' },
        { id: 'db', label: 'PostgreSQL', type: 'database' },
        { id: 'cache', label: 'Redis Cache', type: 'database' },
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
        { id: 'commit', label: 'Git Commit', type: 'step' },
        { id: 'build', label: 'Build', type: 'step' },
        { id: 'test', label: 'Run Tests', type: 'step' },
        { id: 'quality', label: 'Quality Gate', type: 'decision' },
        { id: 'deploy', label: 'Deploy', type: 'step' },
        { id: 'rollback', label: 'Rollback', type: 'step' },
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
 * Liste de tous les diagrammes mockés disponibles
 */
export const MOCK_DIAGRAMS: Record<string, DiagramData> = {
    'AWS Architecture': MOCK_AWS_ARCHITECTURE,
    'Login Flow': MOCK_LOGIN_FLOW,
    'API Architecture': MOCK_API_ARCHITECTURE,
    'CI/CD Pipeline': MOCK_CICD_PIPELINE,
    'Online Purchase Cycle': {
        nodes: [
            { id: 'customer', label: 'Customer', type: 'user' },
            { id: 'browse', label: 'Browse Products', type: 'step' },
            { id: 'cart', label: 'Add to Cart', type: 'step' },
            { id: 'checkout', label: 'Checkout', type: 'step' },
            { id: 'payment', label: 'Payment Gateway', type: 'server' },
            { id: 'success', label: 'Order Confirmed', type: 'step' },
            { id: 'inventory', label: 'Update Inventory', type: 'database' },
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
