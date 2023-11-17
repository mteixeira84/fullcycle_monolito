export interface FindClientUseCaseInputDto {
  id: string;
}

export interface FindClientUseCaseOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
