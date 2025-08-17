import { TestReport } from '@bedrock-apis/va-test';

export interface ErrorMessagesReport {
   general: {
      message: string | null;
      type: string | null;
      code: string;
      id: number;
   }[];
   reports: {
      message: string | null;
      type: string | null;
      code: string;
   }[];
}
export interface BlocksDataReport {
   tags: string[];
   blocks: Record<string, { tags: number[] }>;
}
export interface ItemsDataReport {
   tags: string[];
   items: Record<
      string,
      {
         tags: number[];
         maxStack: number;
         components: Record<string, unknown>;
      }
   >;
}

export interface LocalizationKeysReport {
   entities: Record<string, string>;
   items: Record<string, string>;
   blocks: Record<string, string>;
}

export type TestsReport = TestReport.Run;
