export const RuleAnalysisPortToken = Symbol('RuleAnalysisPort');

export interface RuleAnalysisPort {
  analyze(text: string): Promise<any>;
}
