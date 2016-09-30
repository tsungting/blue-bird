import {AlgorithmParameters} from './algorithm-parameters';

export class AnalysisResult {

  public minimumCashflow: number = 0;
  public minimumProfit: number = 0;
  public maximumProfit: number = 0;
  public endProfit: number = 0;
  public percentageGain: number = 0;
  public referenceGain: number = 0;
  public startPrice : number = 0;
  public endPrice : number = 0;
  public averageStockHeld : number = 0;
  public queryInfo : AlgorithmParameters = new AlgorithmParameters();

  constructor(minimumCashflow = 0, minimumProfit = 0, maximumProfit = 0, endProfit = 0, percentageGain = 0, referenceGain = 0) {
    this.minimumCashflow = minimumCashflow;
    this.minimumProfit = minimumProfit;
    this.maximumProfit = maximumProfit;
    this.endProfit = endProfit;
    this.percentageGain = percentageGain;
    this.referenceGain = referenceGain;
  }
}
