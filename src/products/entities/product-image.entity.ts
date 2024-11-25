import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    // # primera callback defino la relacion con la entidad q quiero relacionar
    () => Product,
    // # segundo callback defino la relacion con la propierdad de la entidad q quiero
    (product) => product.images,
    //# seteon en la relacion, el delete en cascada
    { onDelete: 'CASCADE' },
  )
  product: Product;
}
