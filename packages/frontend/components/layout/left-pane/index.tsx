import Link from 'next/link';
import { MENUS } from '../../../constants/menus';
import styles from './styles.module.css';

export default function LeftPane() {
  return (
    <aside className={styles.container}>
      <header>pic-cube</header>
      <div className={styles.profile}>blank area</div>
      {MENUS.map((menu, key) => (
        <div key={`menubox-${key}`} className={styles.menuBox}>
          <div className={styles.label}>
            <menu.icon />
            <span className={styles.labelText}>{menu.label}</span>
          </div>
          <ul className={styles.content}>
            {menu.items.map((item, key) => (
              <li key={`menubox-item-${key}`} className={styles.item}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
