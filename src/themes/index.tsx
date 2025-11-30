import { Resume } from '../types'
import CompactTheme from './CompactTheme'
import MinimalTheme from './MinimalTheme'
import ModernTheme from './ModernTheme'
import TwoColumnTheme from './TwoColumnTheme'

export interface ThemeComponentProps {
    resume: Resume
    section: string
}

export const THEMES = {
    modern: ModernTheme,
    minimal: MinimalTheme,
    compact: CompactTheme,
    twocolumn: TwoColumnTheme,
} as const

export type ThemeName = keyof typeof THEMES
export type ThemeComponent = (props: ThemeComponentProps) => JSX.Element | null
