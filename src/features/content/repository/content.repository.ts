import { Prisma } from '@prisma/client';

export class ContentRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createContent(data: any): Promise<any> {
    return await this.prisma.content.create({ data });
  }

  async findContentById(id: string): Promise<any | null> {
    return await this.prisma.content.findUnique({ where: { id } });
  }

  async findAllContents(): Promise<any[]> {
    return await this.prisma.content.findMany();
  }

  async updateContent(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.content.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteContent(id: string): Promise<boolean> {
    const result = await this.prisma.content.delete({ where: { id } });
    return !!result;
  }

  async findContentsByType(type: string): Promise<any[]> {
    return await this.prisma.content.findMany({
      where: { type },
    });
  }

  async findContentBySlug(slug: string): Promise<any | null> {
    return await this.prisma.content.findUnique({
      where: { slug },
    });
  }
}
