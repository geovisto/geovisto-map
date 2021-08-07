import { GetTrackProps, SliderItem } from 'react-compound-slider';
import React, { FC, useRef } from 'react';
import { useEventListener } from '../../useEventListener';

interface TrackProps {
    source: SliderItem;
    target: SliderItem;
    getTrackProps: GetTrackProps;
}

export const Track: FC<TrackProps> = ({ source, target, getTrackProps }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const { onMouseDown, onTouchStart } = getTrackProps();

    useEventListener(trackRef, 'mousedown', onMouseDown);
    useEventListener(trackRef, 'touchstart', onTouchStart);

    const playedTrack = source.id === '$$-0' && target.id === '$$-1';
    const className = [
        'range_slider__track',
        playedTrack && 'range_slider__track--played',
    ].filter(Boolean).join(' ');

    return (
        <>
            <div
                ref={trackRef}
                className={className}
                style={{
                    left: `${source.percent}%`,
                    width: `${target.percent - source.percent}%`,
                }}
            />
            <div
                style={{
                    left: `${source.percent}%`,
                    width: `${target.percent - source.percent}%`,
                }}
            />
        </>
    );
};
