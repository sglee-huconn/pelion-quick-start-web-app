import moment from "moment";
import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Devices, Names, Paths, ResourceValue } from ".";
import { Chart } from "react-google-charts";

const TOPAZ = "#00C1DE";
const OPAL = "#FFFFFF";
const PERIDOT = "#95d600";
const AMBER = "#ff6b00";
const ONYX = "#273037";

interface ToolbarProps {
  devices: Devices;
  resourceNames: Names;
  deviceNames: Names;
}

const options = {
  width: 400,
  height: 120,
  yellowFrom: 2.0,
  yellowTo: 3.0,
  redFrom: 4.0,
  redTo:5.0,
  min: 2.0,
  max: 5.0,
  minorTicks: 0.1
}

const state = {
  title: "Voltage",
  voltage: 0.0
}

const getVoltage = () => {
  return Math.random() * 5.0;
}

const getData = () => {
  return [
    ["Label", "Value"],
    [state.title, state.voltage]
  ]
}

const ResourceGraphsNCharts: React.FC<ToolbarProps> = ({ devices, deviceNames, resourceNames }) => {
  const showDevice = (paths: Paths, deviceId: string, resNames: Names) => 
    // Object.keys(paths)
    //   .sort((a, b) => a.localeCompare(b))
    //   .map(res => {
    //     const deviceName = deviceNames[deviceId]
    //       ? deviceNames[deviceId]
    //       : `${deviceId.slice(0, 6)}...${deviceId.slice(-6)}`;
    //     const matchPath = Object.keys(resourceNames)
    //       .map(e => (res.match(e) ? e : false))
    //       .reduce((acc, cur) => (!!cur ? cur : acc), "");
    //     const resourceName = matchPath && resourceNames[matchPath] ? resourceNames[matchPath] : res;
    //     const [val1, val2] = paths[res];

    //     const styleColour =
    //       val1 && val2 && val1.value !== val2.value ? (val1.value > val2.value ? PERIDOT : AMBER) : OPAL;

    //     state.title = resourceName;
    //     state.voltage = val1.value;

    //     console.log(`sun: ${val1} ${val2} ${res} ${paths[res]}`);
    Object.keys(resNames)
      .map(res => {
        const resourceName = resNames[res];

        const defaultResValue: ResourceValue = {
          id: 0,
          device_id: deviceId,
          path: res,
          time: new Date(),
          value: 0,
          epoch: 0
        };

        const [val1, val2] = (paths[res] === undefined) ? [defaultResValue, defaultResValue]: paths[res];

        const styleColour =
          val1 && val2 && val1.value !== val2.value ? (val1.value > val2.value ? PERIDOT : AMBER) : OPAL;    

        state.title = resourceName;
        state.voltage = val1.value;


        return (
          <div className="device" key={res}>
            <h3 title={deviceId}>
              {resourceName}
            </h3>
            <div className="App-graph">
              <div className="VoltageGauge">
                <Chart chartType = "Gauge" width="100%" height="400px" data={getData()} options={options} />
              </div>              
              <div className="graph">{(paths[res] === undefined) ? val1 : showPath(paths[res])}</div>
              <div className="value">
                <h1 title={moment(val1.time, "lll").toString()}>
                  <span style={{ color: styleColour }}>{val1.value.toFixed(1)}</span>
                </h1>
              </div>
            </div>
          </div>
        );
      });

  const showPath = (values: ResourceValue[]) => {
    const max = Math.ceil(values.reduce((a, c) => (a ? (c.value > a ? c.value : a) : c.value), -Infinity));
    const min = Math.floor(values.reduce((a, c) => (c.value < a ? c.value : a), Infinity));
    const margin = Math.ceil((max - min) * 0.1);
    return (
      <ResponsiveContainer aspect={16 / 9} minHeight={150}>
        <LineChart data={values}>
          <Line dot={false} type="monotone" dataKey="value" animationEasing="linear" stroke={TOPAZ} strokeWidth="3px" />
          <XAxis
            scale="time"
            dataKey="epoch"
            type="number"
            stroke={OPAL}
            domain={["auto", "auto"]}
            tickFormatter={d => moment(d).format("LT")}
          />
          <YAxis stroke={OPAL} domain={[Math.floor(min - margin), Math.ceil(max + margin)]} />
          <Tooltip labelFormatter={d => moment(d).format("ll LTS")} contentStyle={{ backgroundColor: ONYX }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const showDevices = (d: Devices, r: Names) => 
    Object.keys(d)
    .sort((a, b) => a.localeCompare(b))
    .map(res => showDevice(d[res], res, r));

  return <React.Fragment>{showDevices(devices, resourceNames)}</React.Fragment>;
};

export default ResourceGraphsNCharts;
