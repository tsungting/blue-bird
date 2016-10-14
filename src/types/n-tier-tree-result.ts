import {AlgorithmParameters} from './algorithm-parameters';
import {AnalysisResult} from './analysis-result';

export class NTierTreeResult {

  public analysisResult: AnalysisResult = null;
  public pricesAnalyzed: Array<number> = [];


  constructor(analysisResult, pricesAnalyzed) {
    this.analysisResult = analysisResult;
    this.pricesAnalyzed = pricesAnalyzed;
  }
}
