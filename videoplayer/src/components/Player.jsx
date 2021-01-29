import React, {useEffect, useRef} from "react";
import '../Player.css';

function  Player(){
    let moving = null;

    const videoRef = useRef();
    const progressRef = useRef();
    const knobRef = useRef();
    const defaultBarRef = useRef();

    const updateBar = () => {
        setInterval(updateProgress,5);
    };

    const updateProgress = () => {
        if(!videoRef.current.ended || !videoRef.current.paused){
            let size= parseInt(videoRef.current.currentTime*defaultBarRef.current.getBoundingClientRect().width/videoRef.current.duration);
            progressRef.current.style.width=size+'px';
            progressRef.current.style.transition = `width ${videoRef.current.duration} ease-in`;
            knobRef.current.style.left=(size - knobRef.current.clientWidth/2) +'px';
            knobRef.current.style.transition = `left ${videoRef.current.duration} ease-in`;
        }
        else {
            clearInterval(updateBar);
        }
    }
    const handleKnobEnd = (event) => {
        if (moving) {
            let mouseX = null;
            barTransition(event);
            event.clientX ? mouseX = event.clientX - progressRef.current.offsetLeft - defaultBarRef.current.getBoundingClientRect().left : mouseX = event.changedTouches[0].clientX - progressRef.current.offsetLeft - defaultBarRef.current.getBoundingClientRect().left;
            videoRef.current.currentTime = mouseX * videoRef.current.duration / defaultBarRef.current.getBoundingClientRect().width;
            moving = null;
            videoRef.current.play();
        }
    }
    const barTransition = (event) => {
        let shuffleWidth = '';
        let shuffleWidthKnob = '';
        let limitBorder = defaultBarRef.current.getBoundingClientRect().left + defaultBarRef.current.getBoundingClientRect().width;
        if(event.clientX) {
            shuffleWidthKnob = event.clientX - moving.clientWidth/2 + 'px';
            shuffleWidth = event.clientX + 'px';
        } else {
            shuffleWidthKnob = event.changedTouches[0].clientX - moving.clientWidth/2 + 'px';
            shuffleWidth = event.changedTouches[0].clientX + 'px';
        }
        if(shuffleWidth <= limitBorder && shuffleWidthKnob <= limitBorder) {
            moving.style.left = shuffleWidthKnob;
            progressRef.current.style.width = shuffleWidth;
            setTranslate(knobRef.current, 'left');
            setTranslate(progressRef.current, 'width');
        }
    }
    const handleKnobMove = (event) => {
        if(moving){
            barTransition(event);
        }
    }
    const handleKnobStart = (event) => {
        videoRef.current.pause();
        clearInterval(updateBar);
        moving = event.target;
        moving.style.height = moving.clientHeight;
        moving.style.width = moving.clientWidth;

    }

    const setTranslate = ( el, posX) => {
        el.style.transition = `${posX} 0.1s linear`;
    }

    useEffect( updateBar,[]);

    return (
        <>
            <div>
                <video preload="auto" autoPlay={true}  muted="muted" ref={videoRef}>
                    <source src='http://techslides.com/demos/sample-videos/small.mp4'/>
                </video>
                <div id="defaultBar"
                     ref={defaultBarRef}
                     onTouchEnd={handleKnobEnd}
                     onMouseUp={handleKnobEnd}
                >
                    <div id='progressBar'
                         ref={progressRef}
                    >
                    </div>
                    <div id='knob'
                         ref={knobRef}
                         onTouchStart={handleKnobStart}
                         onTouchMove={handleKnobMove}
                         onMouseDown={handleKnobStart}
                         onMouseMove={handleKnobMove}

                    />
                </div>
            </div>
        </>
    )
}

export default Player;