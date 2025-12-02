


/**
 * API Route pour créer une session ephemeral OpenAI
 * GET /api/realtime/session
 */
export async function GET() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

        if (!apiKey) {
            return Response.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        // Créer une session ephemeral
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
            console.error('Failed to create ephemeral session:', error)
            return Response.json(
                { error: 'Failed to create session' },
                { status: response.status }
            )
        }

        const data = await response.json()

        return Response.json({
            client_secret: data.client_secret,
            expires_at: data.expires_at,
        })
    } catch (error) {
        console.error('Error creating session:', error)
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
