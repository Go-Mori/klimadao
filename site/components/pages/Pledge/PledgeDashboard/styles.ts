import { css } from "@emotion/css";
import breakpoints from "@klimadao/lib/theme/breakpoints";

export const contentContainer = css`
  grid-column: main;
  gap: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

export const profile = css`
  grid-column: span 2;
  display: grid;
  gap: 1.6rem;
  justify-items: center;
  padding: 6rem 0 2rem 0;

  .profileImage {
    display: grid;
    align-items: center;
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    background-color: var(--surface-02);
    transition: background-color 0.25s ease-in-out;
  }

  p {
    text-transform: uppercase;
  }
`;

export const pledgeChart = css`
  grid-column: span 2;
`;

export const column = css`
  display: grid;
  gap: 2rem;
  grid-column: span 2;
  align-content: start;

  ${breakpoints.desktop} {
    grid-column: span 1;
  }
`;
