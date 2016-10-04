import {AlgorithmParameters} from './algorithm-parameters';

export class AnalysisAggregate {

  public percentageGain: number = 0;
  public referenceGain: number = 0;
  public averageStockHeld : number = 0;
  public totalStocksAnalyzed : number = 0;
  public totalWinOverReference : number = 0;
  public queryInfo : AlgorithmParameters = new AlgorithmParameters();


  constructor(averageStockHeld = 0, totalStocksAnalyzed = 0, totalWinOverReference = 0, queryInfo = null, percentageGain = 0, referenceGain = 0) {
    this.averageStockHeld = averageStockHeld;
    this.totalStocksAnalyzed = totalStocksAnalyzed;
    this.totalWinOverReference = totalWinOverReference;
    this.queryInfo = queryInfo;
    this.percentageGain = percentageGain;
    this.referenceGain = referenceGain;
  }
}
