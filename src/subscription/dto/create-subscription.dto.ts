export class CreateSubscriptionDto {
  readonly subStartDate: Date;
  readonly subEndDate: Date;
  readonly subStatus: boolean;
  readonly subOwner: string;
}
