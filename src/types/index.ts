export type TWindowDimensions = {
    width: number,
    height: number
}
export type TScenesID = number

export type THitZone = {
    x: string,
    y: string,
    goTo: TScenesID,
}

export type TScenes = {
    id: TScenesID,
    imageUrl: string,
    hitZones: THitZone[],
    mainPosition: {
        x: string,
        y: string
    }
}