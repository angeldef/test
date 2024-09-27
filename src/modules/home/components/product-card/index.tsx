import { useContext } from 'react';
import { AuthContext } from '../../../auth';
import styles from './styles.module.scss';

export type Product = {
  title: string;
  text: string;
  img: string;
  key: string;
};

type Props = {
  product: Product;
  onCardClick: Function;
};

export const ProductCard = ({ product, onCardClick }: Props) => {
  const { img } = useContext(AuthContext);

  return (
    <div
      className={styles.card}
      onClick={() => {
        onCardClick(product);
      }}
    >
      {product.img && <img src={img?.[product.img]} className={styles.img} />}
      <div className={styles.title}>{product.title}</div>
      <div className={styles.info}>{product.text}</div>
    </div>
  );
};
