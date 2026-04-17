declare module "react-simple-maps" {
  import { ComponentType, ReactNode, SVGAttributes, CSSProperties } from "react";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      center?: [number, number];
      scale?: number;
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: Geography[] }) => ReactNode;
  }

  export interface Geography {
    rsmKey: string;
    [key: string]: unknown;
  }

  export interface GeographyProps extends SVGAttributes<SVGPathElement> {
    geography: Geography;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    style?: CSSProperties;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }

  export interface LineProps {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    strokeLinecap?: string;
    style?: CSSProperties;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Line: ComponentType<LineProps>;
}
