export interface Hero {
  id: string;
  name: string;
  description?: string | null;
  superPower: string[];
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
