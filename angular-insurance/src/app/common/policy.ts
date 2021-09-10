export class PolicyAndCost {
policy: Policy;
totalCost: number;
}

export class Policy {
insurer: string;
name: string;
documentPath: string;
minCoverValue: number;
maxCoverValue: number;
minCoverTillAge: number;
maxCoverTillAge: number;
multiplierCoverTillAge: number;
additionalFeatures: string[];
id:number;    
}