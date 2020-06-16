import React, { useEffect, useState } from "react";
import superagent from "superagent";
import { DeviceInfo, DeviceResource, Devices, Names, ResourceValue } from ".";
import DeviceList from "./deviceList";
import ResourceGraphs from "./resourceGraphs";
import Toolbar from "./toolbar";

export const apiUrl = window.location.href;

const PAUSE_FOR_POLL = 1000 * 5; // 5 seconds

const resourceNames: Names = {
  "/3316/0/5700": "Avg. Voltage",
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
};

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
        <hr /> <br />
        <div className="App-graph-grid">
          {values.length === 0 && deviceInfo.length === 0 && <h1 className="noData">No data available</h1>}
          <ResourceGraphs devices={devices} resourceNames={resourceNames} deviceNames={deviceNames} />
        </div>
      </article>
    </div>
  );
};

export default App;
