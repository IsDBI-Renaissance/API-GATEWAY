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
