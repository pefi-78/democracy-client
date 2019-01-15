import Realm from 'realm';

export const DECISIONS = {
  YES: 'YES',
  ABSTINATION: 'ABSTINATION',
  NO: 'NO',
  NOT_VOTED: 'NOT_VOTED',
};

const repository = new Realm({
  schema: [
    {
      name: 'Vote',
      primaryKey: 'procedureId',
      properties: {
        procedureId: { type: 'string', indexed: true },
        decision: { type: 'string' },
        constituency: { type: 'int', optional: true },
        votedAt: { type: 'date', default: new Date() },
      },
    },
  ],
});

export default repository;
