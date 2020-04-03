import { css } from 'styled-components';

const isObject = (item) => (
  item && typeof item === 'object' && !Array.isArray(item));

const deepFreeze = (obj) => {
  Object.keys(obj).forEach(
    (key) => key && isObject(obj[key]) && Object.freeze(obj[key]),
  );
  return Object.freeze(obj);
};

export const theme = deepFreeze({
  global: {
    colors: {
      background: '#ffffff',
      brand: '#ED6F00',
      control: {
        dark: '#EF8B27',
        light: '#ED6F00',
      },
      focus: '#FFED00',
      'neutral-1': '#646569',
      'neutral-2': '#004876',
      'neutral-3': '#004876',
      'neutral-4': undefined,
      'accent-1': '#9fd4c9',
      'accent-2': '#d5d848',
      'accent-3': undefined,
      'status-critical': '#dd3000',
      'status-warning': '#f0c954',
      'status-ok': '#008375',
      'status-unknown': '#C3C5C8',
      'status-disabled': '#C3C5C8',
      'dark-1': '#000001',
      'dark-2': '#646569',
    },
    font: {
        family: 'Roboto',
        size: '18px',
        height: '20px',
    },
  },
  anchor: {
    color: {
      dark: 'brand',
      light: '#000000',
    },
  },
  button: {
    extend: css`
      ${(props) => !props.plain && `
        font-weight: 600;
        border-radius: 4px;
      `}
    `,
  },
});

export default theme;