export class Service1Dto {
  text?: string;
}

export class JournalEntryDto {
  account!: string;
  debit!: number;
  credit!: number;
}

export class Service2Dto { // Renamed from Service3Dto
  journal_entries!: JournalEntryDto[];
  additional_context?: string;
}

export class CommodityDetailsDto {
  type!: string;
  quantity!: string;
  delivery_date!: string;
}

export class PreviousTransactionDto {
  date!: string;
  amount!: number;
  counterparty!: string;
}

export class AdditionalContextDto {
  previous_transactions?: PreviousTransactionDto[];
  parties_relationship?: string;
  commodity_details?: CommodityDetailsDto;
}

export class Service4Dto {
  transaction_id!: string;
  date!: string;
  type!: string;
  amount!: number;
  currency!: string;
  institution!: string;
  counterparty!: string;
  location!: string;
  description!: string;
  additional_context?: AdditionalContextDto;
}
