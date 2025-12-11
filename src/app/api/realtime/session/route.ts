<<<<<<< HEAD
/**
 * API Route to create an ephemeral OpenAI Realtime session.
 *
 * Endpoint: GET /api/realtime/session
 *
 * This route fetches an ephemeral client secret from OpenAI's API.
 * This secret allows the client to connect directly to the Realtime WebSocket API
 * without exposing the main API key.
 *
 * @returns JSON response with the client secret and expiration or an error message.
=======



/**
 * API Route pour créer une session ephemeral OpenAI
 * GET /api/realtime/session
>>>>>>> origin/enhance-diagram-visuals-bindings
 */
export async function GET() {
    try {
        const apiKey = process.env.OPENAI_API_KEY

        if (!apiKey) {
            console.error('❌ OPENAI_API_KEY is not configured in environment variables')
            return Response.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

<<<<<<< HEAD
        // Create an ephemeral session
=======
        // Créer une session ephemeral
>>>>>>> origin/enhance-diagram-visuals-bindings
        const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-realtime-preview-2024-12-17',
                voice: 'alloy',
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('❌ Failed to create ephemeral session:', {
                status: response.status,
                statusText: response.statusText,
                error: error
            })
            return Response.json(
                {
                    error: 'Failed to create session',
                    details: response.statusText,
                    status: response.status
                },
                { status: response.status }
            )
        }

        const data = await response.json()

        return Response.json({
            client_secret: data.client_secret,
            expires_at: data.expires_at,
        })
    } catch (error) {
        console.error('❌ Error creating session:', error)
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
