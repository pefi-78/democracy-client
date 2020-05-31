import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import Chart from '../HeaderChart';

const Wrapper = styled.View`
  flex-direction: row;
  padding-horizontal: 18;
  padding-top: 18;
`;

const ProcedureCount = styled.View`
  padding-left: 18;
  justify-content: space-around;
`;

const ProcedureCountText = styled.Text`
  font-size: 20;
  color: #6d6d72;
  font-weight: 500;
`;

const Label = styled.Text`
  font-size: 17;
  color: #9b9b9b;
`;

interface Props {
  totalProcedures: number;
  votedProceduresCount: number;
}

class MemberChart extends PureComponent<Props> {
  render() {
    const { totalProcedures, votedProceduresCount } = this.props;
    return (
      <Wrapper>
        <Chart
          showValue
          valueSize={8}
          floatNumbers={0}
          value={(votedProceduresCount / totalProcedures) * 100}
          width={60}
        />
        <ProcedureCount>
          <ProcedureCountText>
            {votedProceduresCount}/{totalProcedures}
          </ProcedureCountText>
          <Label>Namentliche Abstimmungen</Label>
        </ProcedureCount>
      </Wrapper>
    );
  }
}

export default MemberChart;
