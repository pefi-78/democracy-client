import React, { FC } from 'react';
import styled from 'styled-components/native';

interface DotProps {
  size: number;
  active?: boolean;
}

export const Dot = styled.View<DotProps>`
  background-color: ${({ active }) =>
    active ? 'rgba(68, 148, 211, 1)' : 'rgba(68, 148, 211, 0.5)'};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  margin-horizontal: 5;
`;

const DotsWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  position: relative;
  bottom: 20;
  width: 100%;
`;

interface Props {
  length: number;
  current: number;
}

export const Dots: FC<Props> = ({ length, current, ...rest }) => (
  <DotsWrapper {...rest}>
    {[...Array(length)].map((_, i) => (
      <Dot key={i.toString()} size={5} active={i === current} />
    ))}
  </DotsWrapper>
);
