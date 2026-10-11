import { Prisma } from '@prisma/client';

export class ReviewRepository {
  private prisma: Prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  async createReview(data: any): Promise<any> {
    return await this.prisma.review.create({ data });
  }

  async findReviewById(id: string): Promise<any | null> {
    return await this.prisma.review.findUnique({ where: { id } });
  }

  async findAllReviews(): Promise<any[]> {
    return await this.prisma.review.findMany();
  }

  async updateReview(id: string, data: any): Promise<boolean> {
    const result = await this.prisma.review.update({
      where: { id },
      data,
    });
    return !!result;
  }

  async deleteReview(id: string): Promise<boolean> {
    const result = await this.prisma.review.delete({ where: { id } });
    return !!result;
  }

  async findReviewsByProductId(productId: string): Promise<any[]> {
    return await this.prisma.review.findMany({
      where: { productId },
    });
  }

  async findAverageRatingByProduct(productId: string): Promise<number | null> {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _sum: { rating: true },
    });
    return result._sum.rating ? result._sum.rating / (await this.prisma.review.count({ where: { productId } })) : null;
  }

  async findReviewsByRating(rating: number): Promise<any[]> {
    return await this.prisma.review.findMany({
      where: { rating },
    });
  }
}
