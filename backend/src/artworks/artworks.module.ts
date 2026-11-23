import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service.js';
import { ArtworksController } from './artworks.controller.js';

@Module({
  controllers: [ArtworksController],
  providers: [ArtworksService],
})
export class ArtworksModule {}
