import React from 'react';
import {
  SpeedLimitSign,
  StopSign,
  GiveWaySign,
  NoEntrySign,
  NoOvertakingSign,
  NoLeftTurnSign,
  NoUTurnSign,
  MainRoadSign,
  PedestrianCrossingSign,
  ChildrenSign,
  ParkingSign,
} from './TrafficSignIcons';
import {
  DangerousTurnSign,
  CrossroadsSign,
  GeneralDangerSign,
  SteepDescentSign,
  SteepAscentSign,
  WildAnimalsSign,
  RoadWorksSign,
  SlipperyRoadSign,
  EndOfMainRoadSign,
  HospitalSign,
  GasStationSign,
  RestAreaSign,
  DirectionSign,
  RoundaboutSign,
  StraightAheadSign,
  TurnRightSign,
  BusLaneSign,
  BicycleLaneSign,
} from './AdditionalSignIcons';
import {
  RailwayCrossingSign,
  TunnelSign,
  PriorityIntersectionSign,
  NoParkingSign,
  NoStoppingSign,
  NoHornsSign,
  TurnLeftSign,
  MandatoryRoundaboutSign,
  OneWaySign,
  DeadEndSign,
  PedestrianZoneSign,
  LivingZoneSign,
  MotorwaySign,
  HotelSign,
  FoodSign,
  TelephoneSign,
  FirstAidSign,
  CarServiceSign,
  SignPlateSign,
  MinSpeedSign,
} from './ExtendedSignIcons';

export type SignId = string;

const SIZE = 52;

export function SignRenderer({ signId, size = SIZE }: { signId: SignId; size?: number }) {
  switch (signId) {
    case 'dangerous-turn': return <DangerousTurnSign size={size} />;
    case 'crossroads': return <CrossroadsSign size={size} />;
    case 'general-danger': return <GeneralDangerSign size={size} />;
    case 'pedestrian-crossing': return <PedestrianCrossingSign size={size} />;
    case 'children': return <ChildrenSign size={size} />;
    case 'steep-descent': return <SteepDescentSign size={size} />;
    case 'steep-ascent': return <SteepAscentSign size={size} />;
    case 'wild-animals': return <WildAnimalsSign size={size} />;
    case 'road-works': return <RoadWorksSign size={size} />;
    case 'slippery': return <SlipperyRoadSign size={size} />;
    case 'roundabout-warn': return <RoundaboutSign size={size} />;
    case 'railway': return <RailwayCrossingSign size={size} />;
    case 'tunnel': return <TunnelSign size={size} />;
    case 'stop': return <StopSign size={size} />;
    case 'give-way': return <GiveWaySign size={size} />;
    case 'main-road': return <MainRoadSign size={size} />;
    case 'end-main-road': return <EndOfMainRoadSign size={size} />;
    case 'give-way-oncoming': return <GiveWaySign size={size} />;
    case 'priority-intersection': return <PriorityIntersectionSign size={size} />;
    case 'no-entry': return <NoEntrySign size={size} />;
    case 'no-overtaking': return <NoOvertakingSign size={size} />;
    case 'no-left': return <NoLeftTurnSign size={size} />;
    case 'no-u-turn': return <NoUTurnSign size={size} />;
    case 'speed-30': return <SpeedLimitSign limit={30} size={size} />;
    case 'speed-50': return <SpeedLimitSign limit={50} size={size} />;
    case 'speed-70': return <SpeedLimitSign limit={70} size={size} />;
    case 'speed-90': return <SpeedLimitSign limit={90} size={size} />;
    case 'no-parking': return <NoParkingSign size={size} />;
    case 'no-stopping': return <NoStoppingSign size={size} />;
    case 'no-horns': return <NoHornsSign size={size} />;
    case 'straight': return <StraightAheadSign size={size} />;
    case 'turn-right': return <TurnRightSign size={size} />;
    case 'turn-left': return <TurnLeftSign size={size} />;
    case 'roundabout-mandatory': return <MandatoryRoundaboutSign size={size} />;
    case 'bicycle-lane': return <BicycleLaneSign size={size} />;
    case 'bus-lane': return <BusLaneSign size={size} />;
    case 'min-speed-40': return <MinSpeedSign limit={40} size={size} />;
    case 'parking': return <ParkingSign size={size} />;
    case 'direction': return <DirectionSign size={size} />;
    case 'one-way': return <OneWaySign size={size} />;
    case 'dead-end': return <DeadEndSign size={size} />;
    case 'pedestrian-zone': return <PedestrianZoneSign size={size} />;
    case 'living-zone': return <LivingZoneSign size={size} />;
    case 'motorway': return <MotorwaySign size={size} />;
    case 'hospital': return <HospitalSign size={size} />;
    case 'gas-station': return <GasStationSign size={size} />;
    case 'rest-area': return <RestAreaSign size={size} />;
    case 'hotel': return <HotelSign size={size} />;
    case 'food': return <FoodSign size={size} />;
    case 'telephone': return <TelephoneSign size={size} />;
    case 'first-aid': return <FirstAidSign size={size} />;
    case 'car-service': return <CarServiceSign size={size} />;
    case 'sign-plate': return <SignPlateSign size={size} />;
    default: return <GeneralDangerSign size={size} />;
  }
}
