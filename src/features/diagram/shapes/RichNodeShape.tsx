import React from 'react'
import {
    BaseBoxShapeUtil,
    Geometry2d,
    HTMLContainer,
    RecordProps,
    Rectangle2d,
    T,
    TLBaseShape,
    TLDefaultColorStyle,
    getDefaultColorTheme,
} from '@tldraw/tldraw'
import {
    Activity,
    ArrowRight,
    CircleHelp,
    Database,
    FileText,
    Globe,
    Hexagon,
    Layers,
    Layout,
    MessageSquare,
    MousePointer2,
    Package,
    Settings,
    User,
    Server,
    Smartphone,
    CreditCard,
    Zap
} from 'lucide-react'

// Définition des types de nœuds supportés pour les icônes
type NodeType = 'action' | 'decision' | 'input' | 'process' | 'database' | 'start' | 'end' | 'person' | 'system' | 'step'

// Mapping des types vers les icônes Lucide
const ICON_MAP: Record<string, React.ElementType> = {
    action: Zap,
    decision: CircleHelp,
    input: FileText,
    process: Activity,
    database: Database,
    start: MousePointer2,
    end: Hexagon,
    person: User,
    system: Settings,
    step: ArrowRight,
    server: Server,
    mobile: Smartphone,
    payment: CreditCard,
    default: Layout
}

// Layout vertical pour les entités (ex: Architecture Systeme)
const ENTITY_Vertical_TYPES = ['server', 'mobile', 'database', 'person', 'payment']

// Couleurs pastel personnalisées
const PASTEL_COLORS = {
    action: 'bg-orange-100 border-orange-200 text-orange-800',
    decision: 'bg-indigo-100 border-indigo-200 text-indigo-800',
    input: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    process: 'bg-blue-100 border-blue-200 text-blue-800',
    database: 'bg-slate-100 border-slate-200 text-slate-800',
    default: 'bg-white border-neutral-200 text-neutral-800'
}

type RichNodeShape = TLBaseShape<
    'rich-node',
    {
        w: number
        h: number
        text: string
        nodeType: string
        iconName?: string
    }
>

// Composant SafeIcon pour gérer les erreurs de chargement d'image
const SafeIcon = ({ url, alt, fallbackText }: { url: string, alt: string, fallbackText: string }) => {
    const [error, setError] = React.useState(false);

    if (error) {
        return (
            <div className="w-[60px] h-[60px] rounded-xl flex items-center justify-center bg-gray-100 text-gray-500 font-bold border border-gray-200">
                {fallbackText.charAt(0).toUpperCase()}
            </div>
        )
    }

    return (
        <img
            src={url}
            alt={alt}
            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            onError={() => setError(true)}
        />
    )
}

export class RichNodeShapeUtil extends BaseBoxShapeUtil<RichNodeShape> {
    static override type = 'rich-node' as const
    static override props: RecordProps<RichNodeShape> = {
        w: T.number,
        h: T.number,
        text: T.string,
        nodeType: T.string,
        iconName: T.optional(T.string),
    }

    override getDefaultProps(): RichNodeShape['props'] {
        return {
            w: 200,
            h: 60,
            text: 'New Node',
            nodeType: 'action',
        }
    }

    override getGeometry(shape: RichNodeShape): Geometry2d {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        })
    }

    override component(shape: RichNodeShape) {
        const { w, h, text, nodeType, iconName } = shape.props

        // CAS SPECIAL: Explication (Texte seul)
        if (nodeType === 'explanation') {
            return (
                <HTMLContainer id={shape.id} style={{ pointerEvents: 'all' }}>
                    <div className="w-full h-full flex items-start justify-start p-2 font-draw text-lg leading-relaxed text-neutral-600">
                        {text}
                    </div>
                </HTMLContainer>
            )
        }

        // CAS SPECIAL: Icone externe (Iconify ou SimpleIcons)
        if (nodeType === 'icon' && iconName) {
            // Support pour Iconify (format "collection:name") ou SimpleIcons (slug)
            let iconUrl = '';
            if (iconName.includes(':')) {
                // Iconify API (SVG)
                const [collection, name] = iconName.split(':');
                iconUrl = `https://api.iconify.design/${collection}/${name}.svg`;
            } else {
                // Fallback SimpleIcons
                iconUrl = `https://cdn.simpleicons.org/${iconName.toLowerCase()}/000000`;
            }

            return (
                <HTMLContainer id={shape.id} style={{ pointerEvents: 'all', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <SafeIcon url={iconUrl} alt={iconName} fallbackText={text} />
                    <span className="font-draw text-sm font-medium">{text}</span>
                </HTMLContainer>
            )
        }

        const Icon = ICON_MAP[nodeType] || ICON_MAP.default
        const colorClass = PASTEL_COLORS[nodeType as keyof typeof PASTEL_COLORS] || PASTEL_COLORS.default

        // CAS: Layout Vertical (Entity Column) - Icone au dessus du texte
        if (ENTITY_Vertical_TYPES.includes(nodeType)) {
            return (
                <HTMLContainer id={shape.id} style={{ pointerEvents: 'all' }}>
                    <div className={`w-full h-full flex flex-col items-center justify-center gap-2`}>
                        <div className={`
                            w-16 h-16 rounded-xl shadow-sm border-2 
                            flex items-center justify-center
                            bg-white border-neutral-800 text-neutral-800
                        `}>
                            <Icon size={32} strokeWidth={2} />
                        </div>
                        <span className="font-draw text-sm font-semibold text-center leading-tight max-w-[120px]">
                            {text}
                        </span>
                    </div>
                </HTMLContainer>
            )
        }

        // CAS DEFAULT: Card Layout (Icone à gauche)
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    pointerEvents: 'all',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div
                    className={`
                        w-full h-full 
                        rounded-xl shadow-lg border 
                        flex items-center gap-3 px-4 py-2
                        transition-transform hover:scale-[1.02]
                        animate-in fade-in zoom-in-95 duration-300
                        ${colorClass}
                    `}
                >
                    <div className="p-2 bg-white/50 rounded-lg shrink-0">
                        <Icon size={20} className="opacity-80" />
                    </div>
                    <span className="font-medium text-sm leading-tight line-clamp-2">
                        {text}
                    </span>
                </div>
            </HTMLContainer>
        )
    }

    override indicator(shape: RichNodeShape) {
        return <rect width={shape.props.w} height={shape.props.h} />
    }
}
