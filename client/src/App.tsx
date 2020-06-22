import React, { useEffect, useState } from "react";
import superagent from "superagent";
import { DeviceInfo, DeviceResource, Devices, Names, ResourceValue } from ".";
import DeviceList from "./deviceList";
import ResourceGraphs from "./resourceGraphs";
import Toolbar from "./toolbar";

export const apiUrl = window.location.href;

const PAUSE_FOR_POLL = 1000 * 5; // 5 seconds

const resourceNames: Names = {
  "/3316/0/5700": "Overall Voltage(V)",
  "/3317/0/5700": "Overall Current(A)",

  "/3316/1/5700": "Cell0 Voltage",
  "/3316/2/5700": "Cell1 Voltage",
  "/3316/3/5700": "Cell2 Voltage",
  "/3316/4/5700": "Cell3 Voltage",
  "/3316/5/5700": "Cell4 Voltage",
  "/3316/6/5700": "Cell5 Voltage",
  "/3316/7/5700": "Cell6 Voltage",
  "/3316/8/5700": "Cell7 Voltage",
  "/3316/9/5700": "Cell8 Voltage",
  "/3316/10/5700": "Cell9 Voltage",  

  "/3331/0/10000": "remain capacity(%)",
  "/3331/0/10001": "battery physical capacity(Ah)",
  "/3331/0/10002": "battery remain capacity(Ah)",
  "/3331/0/10003": "battery cycle capacity(Ah)",
  "/3331/0/10004": "current power(W)",

  "/3316/1024/5700": "cell average voltage(V)",
  "/3316/1024/5601": "cell lowest voltage(V)",
  "/3316/1024/5602": "cell highest voltage(V)",
  "/3316/1024/10001": "cell number lowest voltage",
  "/3316/1024/10002": "cell number highest voltage",

  "/3303/0/5700": "temperature(MOS)",
  "/3303/1/5700": "temperature(balance)",
  "/3303/2/5700": "temperature(T1)",
  "/3303/3/5700": "temperature(T2)",
  "/3303/4/5700": "temperature(T3)",
  "/3303/5/5700": "temperature(T4)",

  "/3336/0/10000": "GPS locked",
  "/3336/0/5514": "latitude",
  "/3336/0/5515": "longitude"
};

const resNameOverallVoltage: Names = {
  "/3316/0/5700": "Overall Voltage(V)",
}

const resNameOverallCurrent: Names = {
  "/3317/0/5700": "Overall Current(A)"
}

const resNameCellVoltages: Names = {
  "/3316/1/5700": "Cell0 Voltage",
  "/3316/2/5700": "Cell1 Voltage",
  "/3316/3/5700": "Cell2 Voltage",
  "/3316/4/5700": "Cell3 Voltage",
  "/3316/5/5700": "Cell4 Voltage",
  "/3316/6/5700": "Cell5 Voltage",
  "/3316/7/5700": "Cell6 Voltage",
  "/3316/8/5700": "Cell7 Voltage",
  "/3316/9/5700": "Cell8 Voltage",
  "/3316/10/5700": "Cell9 Voltage"
}

const resNameEtc: Names = {
  "/3331/0/10000": "remain capacity(%)",
  "/3331/0/10001": "battery physical capacity(Ah)",
  "/3331/0/10002": "battery remain capacity(Ah)",
  "/3331/0/10003": "battery cycle capacity(Ah)",
  "/3331/0/10004": "current power(W)",

  "/3316/1024/5700": "cell average voltage(V)",
  "/3316/1024/5601": "cell lowest voltage(V)",
  "/3316/1024/5602": "cell highest voltage(V)",
  "/3316/1024/10001": "cell number lowest voltage",
  "/3316/1024/10002": "cell number highest voltage",
}

const resNameTemp: Names = {
  "/3303/0/5700": "temperature(MOS)",
  "/3303/1/5700": "temperature(balance)",
  "/3303/2/5700": "temperature(T1)",
  "/3303/3/5700": "temperature(T2)",
  "/3303/4/5700": "temperature(T3)",
  "/3303/5/5700": "temperature(T4)",
}

const resNamesGPS: Names = {
  "/3336/0/10000": "GPS locked",
  "/3336/0/5514": "latitude",
  "/3336/0/5515": "longitude"
}

const App: React.FC = () => {
  const [values, setValues] = useState<ResourceValue[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo[]>([]);
  const [deviceNames, setDeviceNames] = useState<Names>({});

  const devices: Devices = {};

  const getValues = () => {
    superagent
      .get(new URL("/values", apiUrl).toString())
      .then(parseValues)
      .finally(() => window.setTimeout(getValues, PAUSE_FOR_POLL));
    superagent.get(new URL("/devices", apiUrl).toString()).then(parseDeviceInfo);
  };

  const parseValues = (result: superagent.Response) => {
    if (result.body) {
      const val: ResourceValue[] = result.body.results.map((a: any) => ({
        ...a,
        value: parseFloat(a.value),
        time: new Date(a.time),
        epoch: new Date(a.time).valueOf(),
      }));
      setValues(val);
    }
  };

  const parseDeviceInfo = (result: superagent.Response) => {
    if (result.body) {
      setDeviceInfo(
        result.body.results
          .map((a: any) => ({
            ...a,
            latest_update: new Date(a.latest_update),
            first_update: new Date(a.first_update),
            resources: JSON.parse(
              a.resources === "" ? "[]" : a.resources
            ).sort((a: DeviceResource, b: DeviceResource) => a.uri.localeCompare(b.uri)),
          }))
          .sort((a: DeviceInfo, b: DeviceInfo) => a.name.localeCompare(b.name))
      );
      setDeviceNames(
        result.body.results
          .map((a: any) => ({ [a.device_id]: a.name }))
          .reduce((acc: Names, cur: { [index: string]: string }) => ({ ...acc, ...cur }), {})
      );
    }
  };
  useEffect(getValues, []);

  values.map(v => {
    if (!devices[v.device_id]) {
      devices[v.device_id] = {};
    }
    if (!devices[v.device_id][v.path]) {
      devices[v.device_id][v.path] = [];
    }
    devices[v.device_id][v.path].push(v);
    return v;
  });

  return (
    <div className="App">
      <header className="App-header">
        <Toolbar deviceInfo={deviceInfo} getValues={getValues} />
      </header>
      <article className="App-article">
        <DeviceList deviceInfo={deviceInfo} />
        <hr />
        value: {values.length}
        <br />
        deviceInfo: {deviceInfo.length}
        <br />
        <h1>Overall Voltage</h1>
        <div className="App-graph-grid">        
          {values.length === 0 && deviceInfo.length === 0 && <h1 className="noData">No data available</h1>}
          <ResourceGraphs devices={devices} resourceNames={resNameOverallVoltage} deviceNames={deviceNames} /> 
        </div>
        <hr />
        <h1>Overall Current</h1>
        <ResourceGraphs devices={devices} resourceNames={resNameOverallCurrent} deviceNames={deviceNames} /> 
        <hr />
        <h1>Cell Voltages</h1>
        <ResourceGraphs devices={devices} resourceNames={resNameCellVoltages} deviceNames={deviceNames} /> 
        <hr />
        <h1>Info.</h1>
        <ResourceGraphs devices={devices} resourceNames={resNameEtc} deviceNames={deviceNames} />         
        <hr />
        <h1>Temperatures</h1>
        <ResourceGraphs devices={devices} resourceNames={resNameTemp} deviceNames={deviceNames} /> 
        <hr />
        <h1>GPS</h1>        
        <ResourceGraphs devices={devices} resourceNames={resNamesGPS} deviceNames={deviceNames} /> 
        <hr />
      </article>
    </div>
  );
};

export default App;
