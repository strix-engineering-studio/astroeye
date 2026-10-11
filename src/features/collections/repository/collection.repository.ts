import { Prisma } from '@prisma/client';

export class CollectionRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createCollection(data: any): Promise<any> {
    return await this.prisma.collection.create({ data });
  }

  async findCollectionById(id: string): Promise<any | null> {
    return await this.prisma.collection.findUnique({ where: { id } });
  }

  async findAllCollections(): Promise<any[]> {
    return await this.prisma.collection.findMany();
  }

  async updateCollection(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.collection.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteCollection(id: string): Promise<boolean> {
    const result = await this.prisma.collection.delete({ where: { id } });
    return !!result;
  }

  async findCollectionsByUserId(userId: string): Promise<any[]> {
    return await this.prisma.collection.findMany({
      where: { userId },
    });
  }

  async addProductToCollection(collectionId: string, productId: string): Promise<boolean> {
    const result = await this.prisma.collection.update({
      where: { id: collectionId },
      data: { products: { connect: { productId } } },
    });
    return !!result;
  }

  async removeProductFromCollection(collectionId: string, productId: string): Promise<boolean> {
    const result = await this.prisma.collection.update({
      where: { id: collectionId },
      data: { products: { disconnect: { productId } } },
    });
    return !!result;
  }
}
