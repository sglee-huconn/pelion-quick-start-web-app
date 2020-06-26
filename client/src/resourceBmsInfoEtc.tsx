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

    let remainCapacity: string = 'no data';
    let battPhysicalCapacity: string = 'no data';
    let batteryRemainCapacity: string = 'no data';
    let batteryCycleCapacity: string = 'no data';
    let currentPower: string = 'no data';

    let cellAverageVoltage: string = 'no data';
    let cellLowestVoltage: string = 'no data';
    let cellHighestVoltage: string = 'no data';
    let cellNumberLowestVoltage: string = 'no data';
    let cellNumberHighestVoltage: string = 'no data';    

    if (paths[remainCapacityPath] !== undefined) {
      remainCapacity = paths[remainCapacityPath][0].value.toString();     
    }

    if (paths[battPhysicalCapacityPath] !== undefined) {
      battPhysicalCapacity = paths[battPhysicalCapacityPath][0].value.toString();     
    }  

    if (paths[batteryRemainCapacityPath] !== undefined) {
      batteryRemainCapacity = paths[batteryRemainCapacityPath][0].value.toString();     
    }      

    if (paths[batteryCycleCapacityPath] !== undefined) {
      batteryCycleCapacity = paths[batteryCycleCapacityPath][0].value.toString();     
    }         
    
    if (paths[currentPowerPath] !== undefined) {
      currentPower = paths[currentPowerPath][0].value.toString();     
    }          


    if (paths[cellAverageVoltagePath] !== undefined) {
      cellAverageVoltage = paths[cellAverageVoltagePath][0].value.toString();     
    }

    if (paths[cellLowestVoltagePath] !== undefined) {
      cellLowestVoltage = paths[cellLowestVoltagePath][0].value.toString();     
    }  

    if (paths[cellHighestVoltagePath] !== undefined) {
      cellHighestVoltage = paths[cellHighestVoltagePath][0].value.toString();     
    }      

    if (paths[cellNumberLowestVoltagePath] !== undefined) {
      cellNumberLowestVoltage = paths[cellNumberLowestVoltagePath][0].value.toString();     
    }         
    
    if (paths[cellNumberHighestVoltagePath] !== undefined) {
      cellNumberHighestVoltage = paths[cellNumberHighestVoltagePath][0].value.toString();     
    }              

    return (
      <table>
        <thead>
          <tr>
            <th>remain capacity(%)</th>
            <th>battery physical capacity(Ah)</th>
            <th>battery remain capacity(Ah)</th>
            <th>battery cycle capacity(Ah)</th>
            <th>current power(W)</th>
            <th>cell average voltage(V)</th>
            <th>cell lowest voltage(V)</th>
            <th>cell highest voltage(V)</th>
            <th>cell number lowest voltage</th>
            <th>cell number highest voltage</th>              
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>{remainCapacity}</td>
              <td>{battPhysicalCapacity}</td>
              <td>{batteryRemainCapacity}</td>
              <td>{batteryCycleCapacity}</td>
              <td>{currentPower}</td>
              <td>{cellAverageVoltage}</td>
              <td>{cellLowestVoltage}</td>
              <td>{cellHighestVoltage}</td>
              <td>{cellNumberLowestVoltage}</td>
              <td>{cellNumberHighestVoltage}</td>                
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

export default ResourceBmsInfoEtc;
