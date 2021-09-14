import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const ScoreChart = (props: HighchartsReact.Props) => {
    return(
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                {...props}
            />
        </div>
    )
}
 