import { test, expect } from '@playwright/test';
import { WebSocketServer } from 'ws';

test.describe('Voice to Diagram E2E', () => {
    let wss: WebSocketServer;

    test.beforeAll(async () => {
        // Start a mock WebSocket server
        wss = new WebSocketServer({ port: 8080 });
        console.log('Mock WebSocket Server running on port 8080');

        wss.on('connection', (ws) => {
            console.log('Client connected to Mock WS');

            ws.on('message', (message) => {
                const msg = JSON.parse(message.toString());
                // console.log('Received:', msg.type);

                if (msg.type === 'session.update') {
                    console.log('Session configured. Sending mock function call...');
                    setTimeout(() => {
                        ws.send(JSON.stringify({
                            type: 'response.function_call_arguments.done',
                            call_id: 'call_123',
                            name: 'generate_diagram',
                            arguments: JSON.stringify({
                                diagram_data: {
                                    nodes: [
                                        { id: 'node-1', label: 'E2E User', type: 'actor', x: 0, y: 0 },
                                        { id: 'node-2', label: 'E2E Server', type: 'server', x: 300, y: 0 }
                                    ],
                                    edges: [
                                        { source: 'node-1', target: 'node-2' }
                                    ],
                                    explanation: "E2E Test Success"
                                }
                            })
                        }));
                    }, 1000);
                }
            });
        });
    });

    test.afterAll(async () => {
        wss.close();
    });

    test('should generate a diagram from voice command', async ({ page }) => {
        // 1. Mock the /api/realtime/session endpoint
        await page.route('/api/realtime/session', async (route) => {
            const json = { client_secret: { value: 'mock-ephemeral-token' } };
            await route.fulfill({ json });
        });

        // 2. Intercept WebSocket constructor to redirect to local mock server
        await page.addInitScript(() => {
            const OriginalWebSocket = window.WebSocket;
            // @ts-expect-error Mocking WebSocket for test environment
            window.WebSocket = function (url, protocols) {
                if (url.includes('api.openai.com')) {
                    console.log('Redirecting WS to mock server');
                    return new OriginalWebSocket('ws://localhost:8080', protocols);
                }
                return new OriginalWebSocket(url, protocols);
            }
            // Copy constants
            // @ts-expect-error Copying constants to mock
            window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
            // @ts-expect-error Copying constants to mock
            window.WebSocket.OPEN = OriginalWebSocket.OPEN;
            // @ts-expect-error Copying constants to mock
            window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
            // @ts-expect-error Copying constants to mock
            window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
        });

        // 3. Navigate to app
        await page.goto('/');

        // 4. Click Start Button (using the new Status Panel button)
        // The button might be "Start" or an icon. Let's find it by role or text.
        // The initial button says "Connect" or "Start"?
        // Panel says "DISCONNECTED" initially.
        // Button has "Connect" text or Microphone icon.
        // Let's look for a button that contains "Connect" or verify via aria-label.
        const connectButton = page.getByRole('button', { name: /Connect|Start/i }).first();
        await connectButton.click();

        // 5. Verify status changes to CONNECTED
        await expect(page.getByText('CONNECTED')).toBeVisible({ timeout: 10000 });

        // 6. Simulate "speaking" (we don't need to actually send audio for the mock to respond if we trigger it,
        // BUT the app only sends messages when audio is processed.
        // HOWEVER, for this test, we might need to manually trigger the 'response.create' if VAD doesn't trigger?
        // Wait, the client sends 'input_audio_buffer.append'.
        // The Server (Mock) needs to decide when to respond. 
        // In our mock above, we listen for 'response.create'? 
        // Actually the client sends 'response.create' ONLY if we ask it to? No.
        // Client sends 'response.create' to force a response?
        // Usually client just streams audio.
        // Improved Mock: Listen for 'input_audio_buffer.append' and then Trigger response after a few chunks.

        // BETTER SIMULATION:
        // We can inject a function to call `connection.sendMessage` directly? No, hard to access internal hooks.
        // We can just wait for the mock server to receive *any* message (the initial config 'session.update').
        // Once we receive 'session.update', we can simulate the AI saying "I heard you" and calling the tool.

        // Let's update the mock logic in the test file via a separate tool call if needed or complex.
        // For now, let's assume the client sends 'session.update' on connect.
        // We will trigger the function call 2 seconds after connection.
    });
});
