import { IoMdImages } from 'react-icons/io';
import { RiSettings4Fill } from 'react-icons/ri';

export const MENUS = [
  {
    label: 'コンテンツ',
    icon: IoMdImages,
    items: [
      { label: '最近追加した項目', href: '/' },
      { label: 'お気に入り', href: '' },
      { label: 'アルバム一覧', href: '' },
      { label: 'タグ一覧', href: '' },
    ],
  },
  {
    label: '設定',
    icon: RiSettings4Fill,
    items: [
      { label: '取り込み設定', href: '/configuration' },
      { label: 'データベース設定', href: '/install' },
    ],
  },
];
