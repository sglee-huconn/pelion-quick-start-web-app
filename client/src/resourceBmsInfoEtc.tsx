import moment, { Duration } from "moment";
import React from "react";
import { Devices, Names, Paths, ResourceValue } from ".";

moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";

interface ToolbarProps {
  devices: Devices;
  resourceNames: Names;
  deviceNames: Names;
}

const ResourceBmsInfoEtc: React.FunctionComponent<ToolbarProps> = ({ devices, deviceNames, resourceNames }) => {

  const showDevice = (paths: Paths, deviceId: string, resNames: Names) => {
    const remainCapacityPath = Object.keys(resNames)[0];
    const battPhysicalCapacityPath = Object.keys(resNames)[1];
    const batteryRemainCapacityPath = Object.keys(resNames)[2];
    const batteryCycleCapacityPath = Object.keys(resNames)[3];
    const currentPowerPath = Object.keys(resNames)[4];

    const cellAverageVoltagePath = Object.keys(resNames)[5];
    const cellLowestVoltagePath = Object.keys(resNames)[6];
    const cellHighestVoltagePath = Object.keys(resNames)[7];
    const cellNumberLowestVoltagePath = Object.keys(resNames)[8];
    const cellNumberHighestVoltagePath = Object.keys(resNames)[9];

    let remainCapacity: string | number = 'no data';
    let battPhysicalCapacity: string | number = 'no data';
    let batteryRemainCapacity: string | number = 'no data';
    let batteryCycleCapacity: string | number = 'no data';
    let currentPower: string | number = 'no data';

    let cellAverageVoltage: string | number = 'no data';
    let cellLowestVoltage: string | number = 'no data';
    let cellHighestVoltage: string | number = 'no data';
    let cellNumberLowestVoltage: string | number = 'no data';
    let cellNumberHighestVoltage: string | number = 'no data';    

    if (paths[remainCapacityPath] !== undefined) {
      const [val1, val2] = paths[remainCapacityPath];
      remainCapacity = val1.value;     
    }

    if (paths[battPhysicalCapacityPath] !== undefined) {
      const [val1, val2] = paths[battPhysicalCapacityPath];
      battPhysicalCapacity = val1.value;     
    }  

    if (paths[batteryRemainCapacityPath] !== undefined) {
      const [val1, val2] = paths[batteryRemainCapacityPath];
      batteryRemainCapacity = val1.value;     
    }      

    if (paths[batteryCycleCapacityPath] !== undefined) {
      const [val1, val2] = paths[batteryCycleCapacityPath];
      batteryCycleCapacity = val1.value;     
    }         
    
    if (paths[currentPowerPath] !== undefined) {
      const [val1, val2] = paths[currentPowerPath];
      currentPower = val1.value;     
    }          


    if (paths[cellAverageVoltagePath] !== undefined) {
      const [val1, val2] = paths[cellAverageVoltagePath];
      cellAverageVoltage = val1.value;     
    }

    if (paths[cellLowestVoltagePath] !== undefined) {
      const [val1, val2] = paths[cellLowestVoltagePath];
      cellLowestVoltage = val1.value;     
    }  

    if (paths[cellHighestVoltagePath] !== undefined) {
      const [val1, val2] = paths[cellHighestVoltagePath];
      cellHighestVoltage = val1.value;     
    }      

    if (paths[cellNumberLowestVoltagePath] !== undefined) {
      const [val1, val2] = paths[cellNumberLowestVoltagePath];
      cellNumberLowestVoltage = val1.value;     
    }         
    
    if (paths[cellNumberHighestVoltagePath] !== undefined) {
      const [val1, val2] = paths[cellNumberHighestVoltagePath];
      cellNumberHighestVoltage = val1.value;     
    }              

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>remain capacity(%)</th>
              <th>battery physical capacity(Ah)</th>
              <th>battery remain capacity(Ah)</th>
              <th>battery cycle capacity(Ah)</th>
              <th>current power(W)</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td title={remainCapacity}></td>
                <td title={battPhysicalCapacity}></td>
                <td title={batteryRemainCapacity}></td>
                <td title={batteryCycleCapacity}></td>
                <td title={currentPower}></td>
              </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>cell average voltage(V)</th>
              <th>cell lowest voltage(V)</th>
              <th>cell highest voltage(V)</th>
              <th>cell number lowest voltage(Ah)</th>
              <th>cell number highest voltage(W)</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td title={cellAverageVoltage}></td>
                <td title={cellLowestVoltage}></td>
                <td title={cellHighestVoltage}></td>
                <td title={cellNumberLowestVoltage}></td>
                <td title={cellNumberHighestVoltage}></td>
              </tr>
          </tbody>
        </table>  
      </div>    
    );
  }

  const showDevices = (d: Devices, r: Names) => 
    Object.keys(d)
    .map(res => showDevice(d[res], res, r));  

  return <React.Fragment>{showDevices(devices, resourceNames)}</React.Fragment>
};

export default ResourceBmsInfoEtc;
