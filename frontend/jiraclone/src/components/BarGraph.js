import { ResponsiveBar } from '@nivo/bar'
import React from "react";

// users should be a list of objects with fields UID, name, list of completed tickets, list of uncompleted tickets. width and height 
// define the width and height of the graph
export function BarGraph({ users, width, height }) {
    console.log(users);
    try {
        return (
            <div style={{ height: height, width: width }}>
                <ResponsiveBar
                    data={users}
                    keys={[
                        'completed',
                        'uncompleted'
                    ]}
                    indexBy="name"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.2}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    isInteractive={false}
                    theme={{
                        axis: {
                            ticks: {
                                text: { fill: "#EEEEEE" }
                            },
                            domain: {
                                line: { stroke: "#EEEEEE" }
                            }
                        }
                    }}
                    colors={(bar) => {
                        if (bar.id === 'completed') {
                            return "#016756"
                        }
                        else {
                            return "#EEEEEE"
                        }
                    }

                    }
                    axisBottom={{
                        tickRotation: -30
                    }
                    }

                ></ResponsiveBar>
            </div>
        )
    }
    catch (error) {
        console.log(error)
    }
}
