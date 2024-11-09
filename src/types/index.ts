export type TrainProps = {
    id?: number
}

export type Train = {
    title?: string,
    description?: string,
    exercises: Exercise[]
}

export type Exercise = {
    name?: string,
    machine?: number,
    series?: number,
    reps?: number,
    load?: number,
    rest?: number
}