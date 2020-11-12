import { observable } from 'mobx';

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
