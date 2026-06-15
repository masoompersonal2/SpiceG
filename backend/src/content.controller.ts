import { Controller, Get, Put, Post, Delete, Body, Param, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

const prisma = new PrismaClient();

@Controller('api/content')
export class ContentController {
  
  // ================= SITE CONTENT =================
  @Get('site')
  async getSiteContent() {
    return prisma.siteContent.findUnique({ where: { id: 1 } });
  }

  @Put('site/:section')
  async updateSiteContent(@Param('section') section: string, @Body() data: any) {
    // The section will be 'hero', 'about', 'online', etc.
    const validSections = ['seo', 'hero', 'about', 'online', 'call', 'event', 'promise', 'footer', 'aboutH', 'contact', 'eventsH', 'galleryH'];
    if (!validSections.includes(section)) return { error: "Invalid section" };

    return prisma.siteContent.update({
      where: { id: 1 },
      data: {
        [section]: data
      }
    });
  }

  // ================= UPLOADS =================
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: "No file uploaded" };
    // Return relative URL that will be served
    return { url: `/uploads/${file.filename}` };
  }

  // ================= CHEF SPECIALS =================
  @Get('chef')
  async getChefSpecials() {
    return prisma.chefSpecial.findMany({ orderBy: { id: 'asc' } });
  }

  @Put('chef/:id')
  async updateChefSpecial(@Param('id') id: string, @Body() data: any) {
    const { id: _, ...updateData } = data;
    return prisma.chefSpecial.update({ where: { id: parseInt(id) }, data: updateData });
  }

  // ================= MENU CATEGORIES =================
  @Get('category')
  async getCategories() {
    return prisma.contentMenuCategory.findMany({ orderBy: { id: 'asc' } });
  }

  @Put('category/:id')
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    const { id: _, ...updateData } = data;
    return prisma.contentMenuCategory.update({ where: { id: parseInt(id) }, data: updateData });
  }

  @Post('category')
  async createCategory(@Body() data: any) {
    return prisma.contentMenuCategory.create({ data });
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string) {
    return prisma.contentMenuCategory.delete({ where: { id: parseInt(id) } });
  }

  // ================= TESTIMONIALS =================
  @Get('testimonial')
  async getTestimonials() {
    return prisma.testimonial.findMany({ orderBy: { id: 'asc' } });
  }

  @Put('testimonial/:id')
  async updateTestimonial(@Param('id') id: string, @Body() data: any) {
    const { id: _, ...updateData } = data;
    return prisma.testimonial.update({ where: { id: parseInt(id) }, data: updateData });
  }

  @Post('testimonial')
  async createTestimonial(@Body() data: any) {
    return prisma.testimonial.create({ data });
  }

  @Delete('testimonial/:id')
  async deleteTestimonial(@Param('id') id: string) {
    return prisma.testimonial.delete({ where: { id: parseInt(id) } });
  }

  // ================= GALLERY IMAGES =================
  @Get('gallery-image')
  async getGalleryImages() {
    return prisma.galleryImage.findMany({ orderBy: { id: 'asc' } });
  }

  @Post('gallery-image')
  async createGalleryImage(@Body() data: any) {
    return prisma.galleryImage.create({
      data: {
        row: parseInt(data.row) || 1,
        title: data.title || "",
        image: data.image
      }
    });
  }

  @Post('gallery-image/bulk-delete')
  async bulkDeleteGalleryImages(@Body() data: { ids: number[] }) {
    if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
      return { success: false, error: 'No IDs provided' };
    }
    
    const result = await prisma.galleryImage.deleteMany({
      where: {
        id: { in: data.ids }
      }
    });
    
    return { success: true, count: result.count };
  }
}
