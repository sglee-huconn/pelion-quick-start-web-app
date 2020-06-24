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

const ResourceCharts: React.FC<ToolbarProps> = ({ devices, deviceNames, resourceNames }) => {
  const showDevice = (paths: Paths, deviceId: string, resNames: Names) => 
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
          <div className="App-graph">
            <div className="Gauge">
              <Chart
                chartType = "Gauge"
                width="100%"
                height="400px"
                data={getData()}
                options={options}
              />
            </div>
          </div>
        </div>          

      );
    });

  const showDevices = (d: Devices, r: Names) => 
    Object.keys(d)
    .sort((a, b) => a.localeCompare(b))
    .map(res => showDevice(d[res], res, r));

  return <React.Fragment>{showDevices(devices, resourceNames)}</React.Fragment>;
};

export default ResourceCharts;
