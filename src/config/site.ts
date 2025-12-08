/**
 * Site configuration object.
 * Contains metadata and links for the application.
 */
export const siteConfig = {
    /** The name of the application. */
    name: 'Draw by Voice',
    /** A short description of the application. */
    description: "Generate software architecture diagrams by voice command using AI.",
    /** The current version of the application. */
    version: '0.1.0',
    /** Information about the author. */
    author: {
        /** Author's name. */
        name: 'Aurélien Rodier',
        /** Author's GitHub profile URL. */
        github: 'https://github.com/aurelienrodier',
    },
    /** Repository URL. */
    repo: 'https://github.com/aurelienrodier/draw-by-voice',
    /** Helpful links. */
    links: {
        /** GitHub repository link. */
        github: 'https://github.com/aurelienrodier/draw-by-voice',
    },
} as const
