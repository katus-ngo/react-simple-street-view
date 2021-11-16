import React, {useEffect, useMemo, useRef, useState} from 'react';
import './App.scss';
import {scenes} from './mock/scenes.json'
import {TScenes, TScenesID} from "./types";
import {BsArrowDownCircle, BsArrowLeftCircle, BsArrowRightCircle, BsArrowUp} from 'react-icons/bs';

function App() {

    const hitZonesRef = useRef<any>([]);

    const [step, setStep] = useState<TScenesID>(scenes[0].id)
    const [history, setHistory] = useState<TScenesID[]>([])


    const selectedScenes = useMemo((): TScenes | undefined => {
        return scenes.find(s => s.id === step)
    }, [step])

    const onClickHitZone = (id: TScenesID) => {
        setStep(id)
    }

    useEffect(() => {
        hitZonesRef.current = []
    }, [step])

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
                                         ref={el => (hitZonesRef.current = [...hitZonesRef.current, el])}
                                         className={"app__hit-zone"}
                                         onClick={() => onClickHitZone(hitZone.goTo)}
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

            <div className={'app__view-action app__view-action--left'}>
                <BsArrowLeftCircle className={"app__view-action-icon"}/>
            </div>

            <div className={'app__view-action app__view-action--right'}>
                <BsArrowRightCircle className={"app__view-action-icon"}/>
            </div>

            <div className={'app__view-action app__view-action--back'}>
                <BsArrowDownCircle className={"app__view-action-icon"}/>
            </div>

        </div>
    );
}

export default App;
