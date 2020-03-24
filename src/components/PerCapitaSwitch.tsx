import React from 'react';
import { observable, autorun } from 'mobx';
import useBooleanSwitch from './hooks/useBooleanSwitch';
import { observer } from 'mobx-react-lite';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';

export class PerCapitaState {
  @observable public perCapitaBool: boolean;

  constructor(initialValue: boolean = true) {
    this.perCapitaBool = initialValue;
  }

  public set = (value: boolean) => {
    this.perCapitaBool = value;
  };

  public toggle = () => {
    this.perCapitaBool = !this.perCapitaBool;
  };
}
export const perCapitaState = new PerCapitaState();

const PerCapitaSwitch = observer(() => {
  const [a, b, SwitchElement] = useBooleanSwitch(
    [
      <>
        <CheckBoxOutlinedIcon />
        Per 1 million
      </>,
      <>
        <CheckBoxOutlineBlankOutlinedIcon /> Per 1 million
      </>,
    ],
    undefined,
    true
  );

  return <SwitchElement value={perCapitaState.perCapitaBool} setValue={perCapitaState.set} />;
});

export default PerCapitaSwitch;
