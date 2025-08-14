export interface ErrorMessagesDataPacketData {
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
export interface BlocksDataPacketData {
   tags: string[];
   blocks: Record<
      string,
      {
         tags: number[];
      }
   >;
}
export interface ItemsDataPacketData {
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

export interface LocalizationKeysPacketData {
   entities: Record<string, string>;
   items: Record<string, string>;
   blocks: Record<string, string>;
}
