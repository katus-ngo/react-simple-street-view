import React, {useEffect, useMemo, useRef, useState} from 'react';
import './App.scss';
import {scenes} from './mock/scenes.json'
import {TScenes, TScenesID} from "./types";
import {BsArrowDownCircle, BsArrowLeftCircle, BsArrowRightCircle, BsArrowUp} from 'react-icons/bs';
import clsx from 'clsx';

function App() {

    let hitZonesRef = useRef<any[]>([]);
    let viewActionRef = useRef<any[]>([]);

    const [step, setStep] = useState<TScenesID>(scenes[0].id)
    const [history, setHistory] = useState<TScenesID[]>([])
    const [showViewAction, setShowViewAction] = useState(true)

    const selectedScenes = useMemo((): TScenes | undefined => {
        return scenes.find(s => s.id === step)
    }, [step])

    const onClickHitZone = (id: TScenesID) => {
        hitZonesRef.current = []
        setStep(id)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if ((hitZonesRef?.current?.concat(viewActionRef.current)).every((ref) => !(ref && ref?.contains(event.target)))) {
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
            {
                !!selectedScenes && (
                    <div key={selectedScenes.id}
                         className={"app__picture-container"}
                         style={{}}>
                        <div className={"app__picture--visible"}
                             style={{
                                 backgroundImage: `url(${selectedScenes.imageUrl})`,
                                 top: selectedScenes.mainPosition.y,
                                 left: `-${selectedScenes.mainPosition.x}`
                             }}
                        >
                            {
                                selectedScenes.hitZones.map((hitZone, index) => (
                                    <div key={index}
                                         ref={(ref) => (hitZonesRef.current[index] = ref)}
                                         className={"app__hit-zone"}
                                         onClick={(e) => onClickHitZone(hitZone.goTo)}
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
                             src={selectedScenes.imageUrl} alt={''}
                        />
                    </div>
                )
            }

            <div className={clsx('app__view-action', 'app__view-action--left', showViewAction && 'app__view-action--left--show')}>
                <span className={'app__view-action-icon-container'}
                      ref={(ref) => (viewActionRef.current = [...viewActionRef.current, ref])}
                >
                    <BsArrowLeftCircle className={"app__view-action-icon"}/>
                </span>
            </div>

            <div className={clsx('app__view-action', 'app__view-action--right', showViewAction && 'app__view-action--right--show')}>
                <span className={'app__view-action-icon-container'}
                      ref={(ref) => (viewActionRef.current = [...viewActionRef.current, ref])}
                >
                    <BsArrowRightCircle className={"app__view-action-icon"}/>
                </span>
            </div>

            <div className={clsx('app__view-action', 'app__view-action--back', showViewAction && 'app__view-action--back--show')}>
                <span className={'app__view-action-icon-container'}
                      ref={(ref) => (viewActionRef.current = [...viewActionRef.current, ref])}
                >
                    <BsArrowDownCircle className={"app__view-action-icon"}/>
                </span>
            </div>

        </div>
    );
}

export default App;
