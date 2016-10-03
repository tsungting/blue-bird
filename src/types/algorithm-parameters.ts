
export class AlgorithmParameters {

  public symbol: string = '';
  public pool: number = 0;
  public actionPoint: number = 0;
  public datasetNumber: string = '0';

  constructor(symbol = '', pool = 0, actionPoint = 0, datasetNnumber = '0') {
    this.symbol = symbol;
    this.pool = pool;
    this.actionPoint = actionPoint;
    this.datasetNumber = datasetNnumber;
  }
}
