export interface IAlign {
  name: 'Căn trái' | 'Căn giữa' | 'Căn phải' | 'Căn đều 2 bên';
  command: 'left' | 'center' | 'right' | 'justify';
  icon:
    | 'icon-align-left-2'
    | 'icon-align-center'
    | 'icon-align-right-2'
    | 'icon-align-justify';
}

export const ALIGN_ITEM_COMMAND: IAlign[] = [
  {
    name: 'Căn trái',
    command: 'left',
    icon: 'icon-align-left-2',
  },
  {
    name: 'Căn giữa',
    command: 'center',
    icon: 'icon-align-center',
  },
  {
    name: 'Căn phải',
    command: 'right',
    icon: 'icon-align-right-2',
  },
  {
    name: 'Căn đều 2 bên',
    command: 'justify',
    icon: 'icon-align-justify',
  },
];
