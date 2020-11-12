import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import '../../../styles/PlotlyCardTheme.less';
import styles from './styles';
import { useSelector } from 'react-redux';

import {
  CloudOutlined,
  HomeOutlined,
  TeamOutlined,
  NodeIndexOutlined,
  DownOutlined,
} from '@ant-design/icons';

import { Switch } from 'antd';

const icons = {
  'Average Rental Prices': <HomeOutlined style={{ fontSize: '1.5rem' }} />,
  'Walkscore': (
    <NodeIndexOutlined style={{ fontSize: '1.5rem' }} />
  ),
  'Population': <TeamOutlined style={{ fontSize: '1.5rem' }} />,
  'Average Temperature': <CloudOutlined style={{ fontSize: '1.5rem' }} />,
};

export default ({ props, display }) => {
  const { graphLabel } = props;
  const data = useSelector(state => state.cardContainer.cityData)
  // const [graphTypeState, setGraphTypeState] = useState('bar');
  const [cities, setCities] = useState(data)
  const [cityData, setData] = useState([])
  const [layout, setLayout] = useState({})

  const [isHidden, setIsHidden] = useState(true);
  const theme = useSelector(state => state.theme);
  const cardHeight = 64 * data.length;
  const sty = styles(display, theme);

  /******* OLD CODE ********
  // const relativeProperty = () => {
  //   switch (graphLabel) {
  //     case 'Population':
  //       return graphTypeState === 'line' ? 'populationhist' : 'population';
  //     case 'Average Household Income':
  //       return graphTypeState === 'line'
  //         ? 'historicalincome'
  //         : 'householdincome';
  //     case 'Average Temperature':
  //       return graphTypeState === 'line'
  //         ? 'historicalweather'
  //         : 'averagetemperature';
  //     case 'Average Home Price':
  //       return graphTypeState === 'line'
  //         ? 'historicalyearlyhousecost'
  //         : 'averagehouse';
  //     default:
  //       return;
  //   }
  // };

  // const graphTypeHandler = () => {
  //   if (graphTypeState === 'bar') {
  //     setGraphTypeState('line');
  //   }
  //   if (graphTypeState === 'line') {
  //     setGraphTypeState('bar');
  //   }
  // };

  // const relativePropertyLineGraph = {
  //   historicalweather: {
  //     x: 'month',
  //     y: 'temperature',
  //   },
  //   populationhist: {
  //     x: 'year',
  //     y: 'pop',
  //   },
  //   historicalyearlyhousecost: {
  //     x: 'year',
  //     y: 'housingcost',
  //   },
  //   historicalincome: {
  //     x: 'year',
  //     y: 'householdincome',
  //   },
  // };
************/

// Used to build the initial city objects that get passed into plotly
function initialCityObj() {
  return {
    name: '',
   x: [],
   y: [],
   type: 'scatter',
   mode: 'markers',
   marker: {
       color: '',
       size: 18,
       symbol: []
       }
   }
   }

// The initial layout object for each city. This is passed into plotly to generate the graph. 
const initialLayoutObj = {
   legend: {
       title: {
           text: 'Cities'
       }
   },
   xaxis: {
       title: {
           text: 'Cities'
       }
   },
   yaxis: {
       title: {
           text: ''
       }
   }
}

// Generates each individual city symbol on the graph
function symbolHelper(counter) {
   switch(counter) {
       case 0:
           return 'circle'
       case 1:
           return 'square'
       case 2:
           return 'diamond'
       case 3:
           return 'cross'
       default:
           return
   }
}

// Generates each individual city color on the graph
function colorHelper(counter) {
   switch(counter) {
       case 0:
           return 'red'
       case 1:
           return 'blue'
       case 2:
           return 'green'
       case 3:
           return 'yellow'
       default:
           return
   }
}

// Translates the simple_climate string in the original city object data into a number for graphing purposes
function climateHelper(simple_climate) {
   switch(simple_climate) {
       case 'hot':
           return [100]
       case 'mild':
           return [75]
       case 'cold':
           return [40]
       default:
           return
   }
}

// Builds the data and layout arrays that plotly uses generate each graph
function graphBuilder() {
   // This array holds each new city object before being set into state
   let array = []
   if (graphLabel === 'Average Rental Prices') {
       data.forEach((c, i) => {
           let city = initialCityObj()
           city.name = c.name
           city.x = ['Studio', 'One', 'Two', 'Three', 'Four']
           city.y = [c.studio, c.onebr, c.twobr, c.threebr, c.fourbr]
           city.marker['color'] = colorHelper(i)
           city.marker['symbol'] = symbolHelper(i)
           array.push(city)
       })
       setData(array)
       setLayout({
           ...initialLayoutObj,
           xaxis: {
               title: {
                   text: 'Number of Bedrooms'
               }
           },
           yaxis: {
               title: {
                   text: 'Monthly Rental Estimate'
               }
           }
       })
   } else if (graphLabel === 'Walkscore') {
       cities.forEach((c, i) => {
           let city = initialCityObj()
           city.name = c.name
           city.x = [c.name]
           city.y = [c.walkscore]
           city.marker['color'] = colorHelper(i)
           city.marker['symbol'] = symbolHelper(i)
           array.push(city)
       })
       setData(array)
       setLayout({
           ...initialLayoutObj,
           yaxis: {
               title: {
                   text: 'Walkscore'
               }
           }
       })
   } else if (graphLabel === 'Population') {
       cities.forEach((c, i) => {
           let city = initialCityObj()
           city.name = c.name
           city.x = [c.name]
           city.y = [c.population]
           city.marker['color'] = colorHelper(i)
           city.marker['symbol'] = symbolHelper(i)
           array.push(city)
       })
       setData(array)
       setLayout({
           ...initialLayoutObj,
           yaxis: {
               title: {
                   text: 'Population'
               }
           }
       })
   } else if (graphLabel === 'Average Temperature') {
       cities.forEach((c, i) => {
           let city = initialCityObj()
           city.mode = 'text'
           city.textfont = {
               size: 30,
               color: 'black'
             }
           city.name = c.name
           city.x = [c.name]
           city.y = climateHelper(c.simple_climate)
           city.text = 
               c.simple_climate === 'hot' ? ['🔥']:
               c.simple_climate === 'mild' ? ['🏖']:
               c.simple_climate === 'cold' ? ['⛄️']: null
           array.push(city)
       })
       setData(array)
       setLayout({
           ...initialLayoutObj,
           yaxis: {
               title: {
                   text: 'Average Temperature'
               }
           }, 
           showlegend: false
       })
   }
}

useEffect(() => {
   graphBuilder()
}, [cities])

  const toggleCard = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className="card" style={sty.card}>
      <div className="cardInfo">
        {icons[graphLabel]}
        <h3 className="plotlyName">{graphLabel}</h3>
        <div className="antdSwitch">
          {/* <Switch
            checkedChildren="Historical"
            size="small"
            onChange={graphTypeHandler}
            disabled={data.length === 1 ? true : false}
          /> */}
          <DownOutlined className="toggle" onClick={toggleCard} />
        </div>
      </div>

      <div className={`plotContainer ${isHidden ? 'hidden' : ''}`}>
        {/* <Plot
          data={data.map(citydata => {
            return graphTypeState === 'line' &&
              citydata[relativeProperty()] !== undefined
              ? /// LINE GRAPH
                {
                  x: citydata[relativeProperty()].map(value => {
                    return value[
                      relativePropertyLineGraph[relativeProperty()].x
                    ];
                  }),
                  y: citydata[relativeProperty()].map(value => {
                    return value[
                      relativePropertyLineGraph[relativeProperty()].y
                    ];
                  }),
                  type: graphTypeState,
                  mode: 'lines+points',
                  marker: {
                    color: citydata.color,
                  },
                  name: `${citydata.cityname}, ${citydata.citystate}`,
                  orientation: 'h',
                  hoverinfo: 'skip',
                  showlegend: false,
                }
              : {
                  /// BAR GRAPH
                  x: [citydata[relativeProperty()]],
                  type: graphTypeState,
                  mode: 'markers',
                  marker: {
                    color: citydata.color,
                  },
                  name: `${citydata.cityname}, ${citydata.citystate}`,
                  orientation: 'h',
                  hoverinfo: 'skip',
                  showlegend: false,
                };
          })}
          layout={{
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            autosize: true,
            margin: { l: 0, t: 0, r: 0, b: 0 },
            yaxis: {
              automargin: true,
              visible: graphTypeState === 'bar' ? false : true,
              gridcolor: '#ffffff20',
            },
            xaxis: {
              automargin: true,
              visible: true,
              gridcolor: '#ffffff20',
            },
            font: {
              color: '#ffffff80',
            },
            line: {
              color: 'white',
            },
          }}
          useResizeHandler
          style={{
            width: '100%',
            height: `${cardHeight}px`,
          }}
          config={{
            displayModeBar: false,
            staticPlot: true,
            responsive: true,
          }}
        /> */}
        <Plot
        data={cityData}
        layout={layout}
      />
      </div>
    </div>
  );
};
