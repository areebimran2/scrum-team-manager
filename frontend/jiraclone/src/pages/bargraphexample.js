import React from 'react';
import { BarGraph } from '../components/BarGraph';

export function BarGraphExample() {
    console.log('BarGraphExample is mounted');
    const exampledata = [
        {
            UID: 1,
            name: "User1",
            completed: 3,
            uncompleted: 6
        },
        {
            UID: 2,
            name: "User2",
            completed: 13,
            uncompleted: 1
        },
        {
            UID: 3,
            name: "User3",
            completed: 6,
            uncompleted: 12
        },
        {
            UID: 4,
            name: "User4",
            completed: 4,
            uncompleted: 10
        }
    ]

    return (

        <BarGraph users={exampledata} width={"1000px"} height={"1000px"} />

    )


}