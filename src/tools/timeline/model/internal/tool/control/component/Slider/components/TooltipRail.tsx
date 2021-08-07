import React, { FC, useCallback, useRef, useState } from "react";
import { GetEventData, GetRailProps } from "react-compound-slider";
import { useEventListener } from "../../useEventListener";
import { Tooltip } from "./Tooltip";

interface TooltipRailProps {
    activeHandleID: string;
    getRailProps: GetRailProps;
    getEventData: GetEventData;
    labels: Array<{ time: string, values: any[] }>;
    disabled: boolean;
}

export const TooltipRail: FC<TooltipRailProps> = ({ labels, activeHandleID, getEventData, getRailProps, disabled }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<{ value: number | null, percent: number | null }>({
        value: null,
        percent: null,
    });

    const { onMouseDown, onTouchStart } = getRailProps();
    useEventListener(sliderRef, "mousedown", onMouseDown, disabled);
    useEventListener(sliderRef, "touchstart", onTouchStart, disabled);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (activeHandleID) {
            setState({ value: null, percent: null });
        } else {
            setState(getEventData(e));
        }
    }, [activeHandleID, getEventData]);

    const onMouseEnter = useCallback(() => {
        sliderRef.current?.addEventListener("mousemove", onMouseMove);
    }, [onMouseMove]);

    const onMouseLeave = useCallback(() => {
        setState({ value: null, percent: null });
        sliderRef.current?.removeEventListener("mousemove", onMouseMove);
    }, [onMouseMove]);

    useEventListener(sliderRef, "mouseenter", onMouseEnter);
    useEventListener(sliderRef, "mouseleave", onMouseLeave);

    const { value, percent } = state;
    return (
        <>
            {value !== null && percent !== null && !activeHandleID && (
                <Tooltip percent={percent} label={labels[value]} />
            )}
            <div ref={sliderRef} className={`react_time_range__rail__outer ${disabled ? 'disabled' : ''}`} />
            <div className={`react_time_range__rail__inner ${disabled ? 'disabled' : ''}`} />
        </>
    );
};
