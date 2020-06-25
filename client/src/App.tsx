import React, { useEffect, useState } from "react";
import superagent from "superagent";
import { DeviceInfo, DeviceResource, Devices, Names, ResourceValue } from ".";
import DeviceList from "./deviceList";
import ResourceGraphsNCharts from "./resourceGraphsNCharts";
import ResourceCharts from "./resourceCharts";
import ResourceGraphs from "./resourceGraphs";
import ResourceBmsInfoEtc from "./resourceBmsInfoEtc";
import ResourceGps from "./resourceGps";
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
  /*         <DeviceList deviceInfo={deviceInfo} /> 
          <h3>GET requests/resonses: 2783 / 2814 [<span id="calculation"></span>], last updated: <span id="datetime"></span></h3>
          <script>
            var dt = new Date();
            document.getElementById("datetime").innerHTML = dt.toLocaleString();
            document.getElementById("calculation").innerHTML = (2783.0 * 100 / 2814.0).toFixed(2) + '%';
        </script>  


  */
  return (
    <div className="App">
      <header className="App-header">
        <Toolbar deviceInfo={deviceInfo} getValues={getValues} />
        <div className="App-header-stat">
          <h3>GET requests/resonses: 2783 / 2814 [98.90%], last updated: 2020. 6. 26. ���� 4:55:00</h3>              
        </div>
      </header>
      <article className="App-article">
        <hr />
        <div><h1>Overall Voltage</h1></div>
        <div className="App-graph-grid">     
          <ResourceGraphsNCharts devices={devices} resourceNames={resNameOverallVoltage} deviceNames={deviceNames} /> 
        </div>
        <hr />
        <div><h1>Overall Current</h1></div>
        <div className="App-graph-grid">
          <ResourceGraphsNCharts devices={devices} resourceNames={resNameOverallCurrent} deviceNames={deviceNames} /> 
        </div>        
        <hr />
        <div><h1>Cell Voltages</h1></div>
        <div className="App-graph-grid">
          <ResourceCharts devices={devices} resourceNames={resNameCellVoltages} deviceNames={deviceNames} /> 
        </div>
        <hr />
        <div><h1>Temperatures</h1></div>
        <div className="App-graph-grid">
          <ResourceGraphs devices={devices} resourceNames={resNameTemp} deviceNames={deviceNames} /> 
        </div>        
        <hr />        
        <div><h1>Info.</h1></div>
        <ResourceBmsInfoEtc devices={devices} resourceNames={resNameEtc} deviceNames={deviceNames} />         
        <hr />   
      </article>
    </div>
  );
};

export default App;
