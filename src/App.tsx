import React, {useEffect, useMemo, useRef, useState} from 'react';
import './App.scss';
import {scenes} from './mock/scenes.json'
import {TScenes, TScenesID} from "./types";
import {BsArrowDownCircle, BsArrowLeftCircle, BsArrowRightCircle, BsArrowUp} from 'react-icons/bs';
import clsx from 'clsx';
import {useWindowDimensions} from "./hooks";

function App() {

    let hitZonesRef = useRef<HTMLDivElement[]>([]);
    let viewActionRef = useRef<HTMLSpanElement[]>([]);
    let activePictureRef = useRef<HTMLDivElement>(null)

    const {width: windowWidth} = useWindowDimensions()

    const [history, setHistory] = useState<TScenesID[]>([scenes[0].id])
    const [showViewAction, setShowViewAction] = useState(true)
    const [positionX, setPositionX] = useState<number>(0)

    const selectedScenes = useMemo((): TScenes | undefined => {
        return scenes.find(s => s.id === history[history.length - 1])
    }, [history])

    const onGoToPlace = (id: TScenesID) => {
        hitZonesRef.current = []
        setHistory(s => [...s, id])
    }

    const onGoBack = () => {
        if (history.length <= 1) {
            return
        }
        hitZonesRef.current = []
        setHistory(s => s.slice(0, s.length - 1))
    }

    const handleLookAround = (num: 1 | -1) => {
        if (!activePictureRef) return

        const {x = 0, right = 0} = activePictureRef?.current?.getBoundingClientRect() || {}
        const distance = (windowWidth / 2 > 375 ? 375 : windowWidth / 2) * num
        if (x + distance > 0) {
            setPositionX(s => s + x * -1)
            return;
        }
        if (right + distance < windowWidth) {
            setPositionX(s => s + windowWidth - right)
            return;
        }
        setPositionX(s => s + distance)
    }

    const getRelationScenes = (selectedScenes: TScenes | undefined) => {
        if (!selectedScenes) return []

        const {hitZones} = selectedScenes
        if (history.length > 1) {
            return [...hitZones.map(hitZone => hitZone.goTo), history[history.length - 2]]
        }
        return hitZones.map(hitZone => hitZone.goTo)
    }

    useEffect(() => {
        setPositionX(0)
    }, [selectedScenes])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const whiteListElement = [...hitZonesRef.current, ...viewActionRef.current]
            const el = event.target
            if (whiteListElement.every((ref) => !(ref && el instanceof Node &&  ref?.contains(el)))) {
                setShowViewAction(s => !s)
                return
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    return (
        <div className="app">
            <div className={"app__picture-list"}>
                {
                    !!selectedScenes && scenes.map((scene: TScenes) => {
                        const isSelectedScreen = scene.id === selectedScenes.id
                        if (getRelationScenes(selectedScenes).concat(selectedScenes.id).includes(scene.id)) {
                            return (
                                <div key={scene.id}
                                     className={clsx("app__picture-container", isSelectedScreen && "app__picture-container--active")}
                                     style={{}}>
                                    <div className={"app__picture--visible"}
                                         ref={isSelectedScreen ? activePictureRef : null}
                                         style={{
                                             backgroundImage: `url(${scene.imageUrl})`,
                                             top: scene.mainPosition.y,
                                             left: `calc(-${scene.mainPosition.x} + ${isSelectedScreen ? positionX : 0}px)`
                                         }}
                                    >
                                        {
                                            scene.hitZones.map((hitZone, index) => (
                                                <div key={index}
                                                     ref={(ref) => isSelectedScreen ? (hitZonesRef.current[index] = ref) : null}
                                                     className={"app__hit-zone"}
                                                     onClick={() => onGoToPlace(hitZone.goTo)}
                                                     style={{
                                                         top: hitZone.y,
                                                         left: hitZone.x
                                                     }}
                                                >
                                                    <BsArrowUp className={"app__hit-icon"}/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <img className={"app__picture--hidden"}
                                         src={scene.imageUrl} alt={''}
                                    />
                                </div>
                            )
                        }
                        return null
                    })
                }
            </div>

            <div
                className={clsx('app__view-action', 'app__view-action--left', showViewAction && 'app__view-action--left--show')}>
                <span className={'app__view-action-icon-container'}
                      ref={(ref) => (viewActionRef.current = [...viewActionRef.current, ref])}
                      onClick={() => handleLookAround(1)}
                >
                    <BsArrowLeftCircle className={"app__view-action-icon"}/>
                </span>
            </div>

            <div
                className={clsx('app__view-action', 'app__view-action--right', showViewAction && 'app__view-action--right--show')}>
                <span className={'app__view-action-icon-container'}
                      ref={(ref) => (viewActionRef.current = [...viewActionRef.current, ref])}
                      onClick={() => handleLookAround(-1)}
                >
                    <BsArrowRightCircle className={"app__view-action-icon"}/>
                </span>
            </div>

            <div
                className={clsx('app__view-action', 'app__view-action--back', showViewAction && history.length > 1 && 'app__view-action--back--show')}>
                <span className={'app__view-action-icon-container'}
                      ref={(ref) => (viewActionRef.current = [...viewActionRef.current, ref])}
                      onClick={onGoBack}
                >
                    <BsArrowDownCircle className={"app__view-action-icon"}/>
                </span>
            </div>

        </div>
    );
}

export default App;
