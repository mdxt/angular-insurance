export enum GenderEnum {
	MALE,
	FEMALE,
	OTHER
}

export enum IncomeRangeEnum {
	ONE_TO_FIVE_LAKH,
	FIVE_TO_TEN_LAKH,
	OVER_TEN_LAKH
}

export enum OccupationTypeEnum {
	SALARIED,
	SELF_EMPLOYED
}

export enum QualificationLevelEnum {
	CLASS_10_AND_BELOW,
	CLASS_12,
	COLLEGE_GRADUATE_AND_ABOVE
}

export class RequestPolicyList {
    gender: GenderEnum;
	age: number;
	tobaccoUser: boolean;
	incomeRange: IncomeRangeEnum;
	occupationType: OccupationTypeEnum;
	qualificationLevel: QualificationLevelEnum;
	coverValue: number;
	coverTillAge: number;
	payMonthly: boolean;
}
