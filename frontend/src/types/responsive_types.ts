
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export const BREAKPOINTS: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};