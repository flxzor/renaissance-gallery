import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateArtworkDto } from './dto/create-artwork.dto.js';
import { UpdateArtworkDto } from './dto/update-artwork.dto.js';
import { Artwork } from './entities/artwork.entity.js';

@Injectable()
export class ArtworksService {
  private artworks: Artwork[] = [
    {
      id: 'art-001',
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: 1503,
      period: 'Renaissance Tinggi',
      description:
        'Potret setengah badan yang diyakini menggambarkan Lisa Gherardini, istri seorang pedagang Florence. Teknik sfumato membuat peralihan cahaya dan bayangan tampak lembut. Kini tersimpan di Museum Louvre, Paris.',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
      isMasterpiece: true,
    },
    {
      id: 'art-002',
      title: 'The Birth of Venus',
      artist: 'Sandro Botticelli',
      year: 1485,
      period: 'Renaissance Awal',
      description:
        'Venus tiba di pantai di atas kerang, ditiup angin Zephyrus dan disambut salah satu Horae. Salah satu lukisan bertema mitologi klasik paling terkenal dari masa Renaissance, koleksi Galeri Uffizi, Florence.',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/960px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
      isMasterpiece: true,
    },
    {
      id: 'art-003',
      title: 'The School of Athens',
      artist: 'Raphael',
      year: 1511,
      period: 'Renaissance Tinggi',
      description:
        'Fresko di Stanza della Segnatura, Vatikan, yang mengumpulkan para filsuf dan ilmuwan Yunani kuno dalam satu ruang arsitektural berperspektif. Plato dan Aristoteles berdiri di pusat komposisi.',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/960px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg',
      isMasterpiece: true,
    },
    {
      id: 'art-004',
      title: 'The Creation of Adam',
      artist: 'Michelangelo',
      year: 1512,
      period: 'Renaissance Tinggi',
      description:
        'Panel fresko pada langit-langit Kapel Sistina, Vatikan, yang menampilkan Tuhan mengulurkan tangan kepada Adam. Celah sempit di antara kedua jari menjadi salah satu citra paling dikenal dalam seni Barat.',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/960px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg',
      isMasterpiece: true,
    },
    {
      id: 'art-005',
      title: 'Primavera',
      artist: 'Sandro Botticelli',
      year: 1480,
      period: 'Renaissance Awal',
      description:
        'Alegori musim semi di taman jeruk dengan Venus di tengah, bersama Tiga Graces, Mercurius, dan Flora. Lukisan panel ini dikaitkan dengan lingkungan keluarga Medici dan kini berada di Galeri Uffizi, Florence.',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Sandro_Botticelli_-_La_Primavera_-_Google_Art_Project.jpg/960px-Sandro_Botticelli_-_La_Primavera_-_Google_Art_Project.jpg',
      isMasterpiece: false,
    },
    {
      id: 'art-006',
      title: 'The Last Supper',
      artist: 'Leonardo da Vinci',
      year: 1498,
      period: 'Renaissance Tinggi',
      description:
        'Mural di dinding refektori Santa Maria delle Grazie, Milan, yang menangkap saat Yesus mengumumkan bahwa salah satu muridnya akan mengkhianatinya. Perspektif linier mengarahkan pandangan ke sosok Kristus.',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/960px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg',
      isMasterpiece: true,
    },
  ];

  create(createArtworkDto: CreateArtworkDto): Artwork {
    const isDuplicate = this.artworks.some(
      (item) =>
        item.title.trim().toLowerCase() ===
        createArtworkDto.title.trim().toLowerCase(),
    );

    if (isDuplicate) {
      throw new ConflictException(
        `Karya seni dengan judul '${createArtworkDto.title}' sudah ada dalam koleksi`,
      );
    }

    const newArtwork: Artwork = {
      id: `art-${Date.now()}`,
      image: '',
      isMasterpiece: false,
      ...createArtworkDto,
    };

    this.artworks.unshift(newArtwork);
    return newArtwork;
  }

  findAll(): Artwork[] {
    return this.artworks;
  }

  findOne(id: string): Artwork {
    const artwork = this.artworks.find((item) => item.id === id);
    if (!artwork) {
      throw new NotFoundException(
        `Karya seni dengan ID '${id}' tidak ditemukan`,
      );
    }
    return artwork;
  }

  update(id: string, updateArtworkDto: UpdateArtworkDto): Artwork {
    const index = this.artworks.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Karya seni dengan ID '${id}' tidak ditemukan`,
      );
    }

    if (updateArtworkDto.title) {
      const isDuplicate = this.artworks.some(
        (item) =>
          item.id !== id &&
          item.title.trim().toLowerCase() ===
            updateArtworkDto.title?.trim().toLowerCase(),
      );
      if (isDuplicate) {
        throw new ConflictException(
          `Karya seni dengan judul '${updateArtworkDto.title}' sudah ada dalam koleksi`,
        );
      }
    }

    this.artworks[index] = {
      ...this.artworks[index],
      ...updateArtworkDto,
    };

    return this.artworks[index];
  }

  remove(id: string): { message: string; deletedArtwork: Artwork } {
    const index = this.artworks.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Karya seni dengan ID '${id}' tidak ditemukan`,
      );
    }

    const [deletedArtwork] = this.artworks.splice(index, 1);
    return {
      message: `Karya seni '${deletedArtwork.title}' berhasil dihapus`,
      deletedArtwork,
    };
  }
}
