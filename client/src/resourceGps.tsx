import moment, { Duration } from "moment";
import React from "react";
import { Devices, Names, Paths, ResourceValue } from ".";

moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";

interface ToolbarProps {
  devices: Devices;
  resourceNames: Names;
  deviceNames: Names;
}

const ResourceGps: React.FunctionComponent<ToolbarProps> = ({ devices, deviceNames, resourceNames }) => {

  const showDevice = (paths: Paths, deviceId: string, resNames: Names) => {
    const gpsLockedPath = Object.keys(resNames)[0];
    const latitudePath = Object.keys(resNames)[1];
    const longitudePath = Object.keys(resNames)[2];

    let gpsLocked: string = 'no data';
    let latitude: string = 'no data'; 
    let longitude: string = 'no data';

    if (paths[gpsLockedPath] !== undefined) {
      gpsLocked = paths[gpsLockedPath][0].value.toString();     
    }

    if (paths[latitudePath] !== undefined) {
      latitude = paths[latitudePath][0].value.toString();     
    }  

    if (paths[longitudePath] !== undefined) {
      longitude = paths[longitudePath][0].value.toString();     
    }      

    return (
      <table>
        <thead>
          <tr>
            <th>GPS Locked</th>
            <th>Latitude</th>                
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>{gpsLocked}</td>
              <td>{latitude}</td>                           
              <td>{longitude}</td>
            </tr>
        </tbody>
      </table>

    );
  }

  const showDevices = (d: Devices, r: Names) => 
    Object.keys(d)
    .map(res => showDevice(d[res], res, r));  

  return <React.Fragment>{showDevices(devices, resourceNames)}</React.Fragment>
};

export default ResourceGps;