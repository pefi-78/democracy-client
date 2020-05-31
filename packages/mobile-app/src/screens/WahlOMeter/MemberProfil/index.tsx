import React, { useContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import ContactBox from './components/ContactBox';
// Components
import PartyComponent from '../../Bundestag/Procedure/components/GovernmentVoteResults/Parties';
import Chart from './Chart';
import ChartLegend from '../../Bundestag/Procedure/components/Charts/ChartLegend';
import Folding from '@democracy-deutschland/mobile-ui/src/components/shared/Folding';
// GraphQL
import { useQuery } from '@apollo/react-hooks';
import { GET_DEPUTY_PROFILE } from './graphql/query/getDeputyProfile';
import {
  GetDeputyProfile,
  GetDeputyProfileVariables,
  GetDeputyProfile_deputiesOfConstituency_procedures,
} from './graphql/query/__generated__/GetDeputyProfile';
import { ConstituencyContext } from '../../../context/Constituency';
import { useNavigation } from '@react-navigation/core';

const ScrollWrapper = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 18,
  },
})`
  flex-grow: 1;
  background-color: #fff;
`;

const MemberImageWrapper = styled.View`
  width: 100%;
  max-width: 284;
  height: 379;
  align-items: center;
  padding-bottom: 8;
`;

const MemberImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  flex: 1;
  height: 379;
  width: 284;
  border-radius: 142;
`;

const Party = styled(PartyComponent)`
  position: absolute;
  right: 0;
  bottom: 30;
`;

const Text = styled.Text`
  font-size: 15;
`;

const TextGrey = styled(Text)`
  color: #6d6d72;
`;

const TextLighGrey = styled(Text)`
  color: #9b9b9b;
`;

const SegmentWrapper = styled.View`
  width: 100%;
  padding-top: 18;
`;

export interface Contacts {
  name: string;
  URL: string;
}

export const MemberProfil = () => {
  const navigation = useNavigation();
  const { constituency } = useContext(ConstituencyContext);
  const { data, loading } = useQuery<
    GetDeputyProfile,
    GetDeputyProfileVariables
  >(GET_DEPUTY_PROFILE, {
    variables: {
      constituency,
      directCandidate: true,
    },
  });

  useEffect(() => {
    if (data) {
      navigation.setOptions({ title: data.deputiesOfConstituency[0].name });
    }
  }, [data, navigation]);

  const getActivityIndicator = () => <ActivityIndicator size="large" />;

  const getVotingData = (procedureCountByDecision: {
    YES: number;
    ABSTINATION: number;
    NO: number;
    NOTVOTED: number;
  }) => {
    return [
      {
        label: 'Zustimmungen',
        color: '#99C93E',
        value: procedureCountByDecision.YES,
      },
      {
        label: 'Enthaltungen',
        color: '#4CB0D8',
        value: procedureCountByDecision.ABSTINATION,
      },
      {
        label: 'Ablehnungen',
        color: '#D43194',
        value: procedureCountByDecision.NO,
      },
      {
        label: 'Abwesend',
        color: '#B1B3B4',
        value: procedureCountByDecision.NOTVOTED,
      },
    ];
  };

  const getProcedureCountByDecision = (
    procedures: GetDeputyProfile_deputiesOfConstituency_procedures[],
  ) => {
    return procedures.reduce(
      (prev, { decision }) => {
        return { ...prev, [decision]: prev[decision] + 1 };
      },
      {
        YES: 0,
        ABSTINATION: 0,
        NO: 0,
        NOTVOTED: 0,
      },
    );
  };

  if (loading || !data) {
    return getActivityIndicator();
  }

  const {
    imgURL,
    party,
    name,
    job,
    biography,
    contact,
    procedures,
    totalProcedures,
  } = data.deputiesOfConstituency[0];

  let contacts: Contacts[] = [];
  if (contact) {
    contacts = contact.email
      ? [{ name: 'email', URL: contact.email }, ...contact.links]
      : [...contact.links];
  }

  const procedureCountByDecision = getProcedureCountByDecision(procedures);

  const votedProceduresCount =
    procedures.length - procedureCountByDecision.NOTVOTED;

  return (
    <ScrollWrapper>
      {constituency && (
        <>
          <MemberImageWrapper>
            <MemberImage source={{ uri: imgURL }} />
            <Party party={party} />
          </MemberImageWrapper>
          <Text>{name}</Text>
          <TextLighGrey>Direktkadidat WK {constituency}</TextLighGrey>
          <TextGrey>{job}</TextGrey>
          <Chart
            totalProcedures={totalProcedures || 0}
            votedProceduresCount={votedProceduresCount}
          />
          <ChartLegend data={getVotingData(procedureCountByDecision)} />
          <SegmentWrapper>
            <Folding title="Biographie">
              <TextGrey>{biography}</TextGrey>
            </Folding>
            <Folding title="Kontakt" opened>
              {!!contact && <TextGrey>{contact.address}</TextGrey>}
              {contacts.length !== 0 && <ContactBox contacts={contacts} />}
            </Folding>
          </SegmentWrapper>
        </>
      )}
    </ScrollWrapper>
  );
};
