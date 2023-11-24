import HanziWriter from 'hanzi-writer';
interface Props {
    /**
     * Controls whether the outline is shown or hidden on the first render.
     * Default: true
     */
    showOutline?: boolean;
    /**
     * Controls whether the character is shown or hidden on the first render.
     * Default: true
     */
    showCharacter?: boolean;
    /**
     * Width of the canvas in pixels.
     * Default: 100
     */
    width?: number;
    /**
     * Height of the canvas in pixels.
     * Default: 100
     */
    height?: number;
    /**
     * Padding between the character and the edge of the canvas in pixels.
     * Default: 20
     */
    padding?: number;
    /**
     * Speed at which to draw each stroke. Must be greater than 0.
     * Increase this number to draw strokes faster, decrease to draw strokes slower.
     * Default: 1
     */
    strokeAnimationSpeed?: number;
    /**
     * Speed at which to highlight each stroke when giving hints in a quiz. Must be greater than 0.
     * Increase this number to highlight faster, decrease to highlight slower.
     * Default: 2
     */
    strokeHighlightSpeed?: number;
    /**
     * Time in milliseconds to transition between showing and hiding strokes when calling writer.show() and writer.hide().
     * Default: 400
     */
    strokeFadeDuration?: number;
    /**
     * Time in milliseconds between each stroke when animating.
     * Default: 1000
     */
    delayBetweenStrokes?: number;
    /**
     * Time in milliseconds between each animation loop when looping animations.
     * Default: 2000
     */
    delayBetweenLoops?: number;
    /**
     * The color to draw each stroke.
     * Default: '#555'
     */
    strokeColor?: string;
    /**
     * The color to draw the radical in the stroke if radical data is present.
     * Radicals will be drawn the same color as other strokes if this is not set.
     */
    radicalColor?: string;
    /**
     * The color to use for highlighting in quizzes.
     * Default: '#AAF'
     */
    highlightColor?: string;
    /**
     * The color of the character outline.
     * Default: '#DDD'
     */
    outlineColor?: string;
    /**
     * The color of the lines drawn by users during quizzing.
     * Default: '#333'
     */
    drawingColor?: string;
    /**
     * The width of the lines drawn by users during quizzing in pixels.
     * Default: 4
     */
    drawingWidth?: number;
    /**
     * The number of misses before a stroke highlight hint is given to the user.
     * Set to false to disable. This can also be set when creating a quiz.
     * Default: 3
     */
    showHintAfterMisses?: number | false;
    /**
     * The number of misses before forcing the stroke to be marked correct.
     * This can also be set when creating a quiz.
     * Default: Disabled
     */
    markStrokeCorrectAfterMisses?: number | false;
    /**
     * This can be set to start the quiz at a stroke other than the first stroke.
     * This can also be set when creating a quiz.
     * Default: 0
     */
    quizStartStrokeNum?: number;
    /**
     * Allow stroke to be drawn backwards during quizzing.
     * This can also be set when creating a quiz.
     * Default: false
     */
    acceptBackwardsStrokes?: boolean;
    /**
     * Controls whether a quiz briefly highlights the character when the user finishes drawing the whole character.
     * This can also be set when creating a quiz.
     * Default: true
     */
    highlightOnComplete?: boolean;
    /**
     * The color to use when highlighting the character on complete in quizzes.
     * If not set, `highlightColor` will be used instead.
     * Only relevant if `highlightOnComplete` is true.
     */
    highlightCompleteColor?: string;
    /**
     * Background Element to use when have background slot
     */
    backgroundRef?: HTMLElement;
    /**
     * Custom function to load character data.
     * See the section on Loading character data for more info on usage.
     */
    /**
     * Callback for when character data is loaded successfully.
     * This function is called with the data that was loaded.
     * This can be used to implement a loading spinner.
     */
    onLoadCharDataSuccess?: (data: any) => void;
    /**
     * Callback for when character data loading fails.
     * This function is passed whatever the failure reason is from `charDataLoader`.
     */
    onLoadCharDataError?: (error: any) => void;
    /**
     * Set this to 'canvas' to render using a 2D canvas instead of SVG.
     * May have better performance on some devices.
     * Default: 'svg'
     */
    renderer?: 'svg' | 'canvas';
}
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    showOutline: boolean;
    showCharacter: boolean;
    width: number;
    height: number;
    padding: number;
    strokeAnimationSpeed: number;
    strokeHighlightSpeed: number;
    strokeFadeDuration: number;
    delayBetweenStrokes: number;
    delayBetweenLoops: number;
    strokeColor: string;
    highlightColor: string;
    outlineColor: string;
    drawingColor: string;
    drawingWidth: number;
    showHintAfterMisses: number;
    markStrokeCorrectAfterMisses: boolean;
    quizStartStrokeNum: number;
    acceptBackwardsStrokes: boolean;
    highlightOnComplete: boolean;
    charDataLoader: () => void;
    onLoadCharDataSuccess: (data: any) => void;
    onLoadCharDataError: (error: any) => void;
    renderer: string;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    initialized: (instance: HanziWriter) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    showOutline: boolean;
    showCharacter: boolean;
    width: number;
    height: number;
    padding: number;
    strokeAnimationSpeed: number;
    strokeHighlightSpeed: number;
    strokeFadeDuration: number;
    delayBetweenStrokes: number;
    delayBetweenLoops: number;
    strokeColor: string;
    highlightColor: string;
    outlineColor: string;
    drawingColor: string;
    drawingWidth: number;
    showHintAfterMisses: number;
    markStrokeCorrectAfterMisses: boolean;
    quizStartStrokeNum: number;
    acceptBackwardsStrokes: boolean;
    highlightOnComplete: boolean;
    charDataLoader: () => void;
    onLoadCharDataSuccess: (data: any) => void;
    onLoadCharDataError: (error: any) => void;
    renderer: string;
}>>> & {
    onInitialized?: ((instance: HanziWriter) => any) | undefined;
}, {
    showOutline: boolean;
    showCharacter: boolean;
    width: number;
    height: number;
    padding: number;
    strokeAnimationSpeed: number;
    strokeHighlightSpeed: number;
    strokeFadeDuration: number;
    delayBetweenStrokes: number;
    delayBetweenLoops: number;
    strokeColor: string;
    highlightColor: string;
    outlineColor: string;
    drawingColor: string;
    drawingWidth: number;
    showHintAfterMisses: number | false;
    markStrokeCorrectAfterMisses: number | false;
    quizStartStrokeNum: number;
    acceptBackwardsStrokes: boolean;
    highlightOnComplete: boolean;
    onLoadCharDataSuccess: (data: any) => void;
    onLoadCharDataError: (error: any) => void;
    renderer: "svg" | "canvas";
}, {}>, {
    background?(_: {}): any;
}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
